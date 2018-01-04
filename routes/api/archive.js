const keystone = require('keystone');

const awards = ['Community Award', 'Loophole Award', 'Best Documentary',
      'Best Short', 'Best Feature', 'Best Animation', 'Best Music Video',
      'Special Mention of the Jury', 'Special Mention of the Loophole',
      'Independant Life Award'];

const categories = ['Short', 'Feature', 'Music Video', 'Animation', 'Documentary'];

exports = module.exports = function (req, res) {
	const query = keystone.list('Movie').paginate({
		page: req.query.page || 1,
		perPage: 12,
		maxPages: 10,
	})
	.sort({
		'screenTime.year': 1,
		'screenTime.day': 1,
		'screenTime.position': 1,
	});

	if (req.query.y) {
		query.where({ 'screenTime.year': +req.query.year });
	}
	if (req.query.d) {
		query.where({ 'screenTime.day': +req.query.d });
	}
	if (req.query.q) {
		let regex = new RegExp(req.query.q, 'i');
		query.or([{ title: regex }, { 'director.name': regex }]);
	}
	if (req.query.a) {
		query.where({ award: req.query.a });
	}
	if (req.query.c) {
		query.where({ category: req.query.c });
	}

	query.exec(function (err, docs) {
		docs.results.forEach(d => d.format());
		res.json(docs);
	});
};
