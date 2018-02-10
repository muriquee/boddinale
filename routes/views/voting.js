const keystone = require('keystone');

exports = module.exports = (req, res, next) => {

	let view = new keystone.View(req, res);

	let locals = res.locals;
	locals.section = 'voting';

	view.on('init', (next) => {
		keystone.list('Movie').model.find()
			.where({ 'screenTime.year': 2018 })
			.sort({ votes: -1 })
			.exec((err, docs) => {
				docs.forEach(d => d.format());
				res.locals.movies = docs;
				next(err);
			});
	});

	view.render('voting');
};
