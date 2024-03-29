var keystone = require('keystone');

exports = module.exports = function (req, res) {

	return res.redirect('/day/11')

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.on('init', function (next) {
		keystone.list('Content').model.findOne({ title: 'LastDay' })
			.exec(function (err, doc) {
				locals.data = doc;
				next(err);
			});
	});

	// Render the view
	view.render('index');
};
