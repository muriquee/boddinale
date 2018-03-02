const keystone = require('keystone');
awards
Order = ['feature', 'doc', 'short', 'animation', 'music video', 'community award', 'urban spree award', 'special mention of the jury']

const awards = ['Best Feature', 'Best Documentary', 'Best Short', 'Best Animation', 'Best Music Video',
	'Community Award', 'Loophole Award', 'Special Mention of the Loophole',
    'Independant Life Award', 'Urban Spree Award', 'Special Mention of the Jury',];

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);

	let locals = res.locals;
	locals.section = 'home';

	if (!req.params.day || !(+req.params.day >= 1 && +req.params.day <= 11)) {
		return res.status(404).send();
	}

	console.log('params: ', req.params);

	locals.data = {
		day: +req.params.day,
		movies: [],
	};

	view.on('init', function (next) {
		if (locals.data.day < 11) {
			keystone.list('Movie').model
				.find()
				.where({ 'screenTime.year': new Date().getFullYear() })
				.where({ 'screenTime.day': req.params.day })
				.sort({
					'screenTime.year': 1,
					'screenTime.day': 1,
					'screenTime.position': 1,
				})
				.exec(function (err, docs) {
					locals.data.movies = docs;
					docs.forEach(d => d.format());
					docs = docs.sort((a,b) => {
						let i = awards.indexOf(a.award)
						let j = awards.indexOf(b.award)
						return i < j ? -1 : i == j ? 0 : -1
					})
					console.log('executed query for day ' + req.params.day);
					console.log('found ' + docs.length + ' documents');
					next(err);
				});
		}
		else {
			keystone.list('Content').model
				.findOne()
				.where({ title: 'LastDay' })
				.exec(function (err, doc) {
					if (doc) locals.data.content = doc.content;
					else locals.data.content = 'No Content named \'Last Day\' found';
					keystone.list('Movie').model.find()
						.where({
							'screenTime.year' : 2018,
							award : { $ne: null },
						})
						.exec((err, movies) => {
							movies.forEach(m => m.format())
							locals.data.movies = movies
							next(err);
						})
				});
		}
	});

	view.render('day');
};
