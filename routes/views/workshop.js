const keystone = require('keystone');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);
	let locals = res.locals;

	locals.section = 'workshop';

	locals.data = {};


	view.on('init', function (next) {
		keystone.list('Workshop').model
			.findOne({ slug: req.params.slug })
			.exec(function (err, doc) {
				locals.data = { movie: doc };
				next(err);
			});
	});

	view.render('workshop');
};
