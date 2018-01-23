const keystone = require('keystone');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);
	let locals = res.locals;

	locals.section = 'academy';

	locals.data = {};

	view.on('init', next => {
		keystone.list('Workshop').model.find()
			.where({ 'screenTime.year': 2017 })
			.sort({
				'screenTime.position': 1,
			})
			.exec((err, docs) => {
				locals.data.workshops = docs;
				next(err);
			});
	});

	view.render('academy');
};
