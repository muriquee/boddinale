const keystone = require('keystone');

exports = module.exports = (req, res) => {
	let view = new keystone.View(req, res);

	view.render('cookies');
};
