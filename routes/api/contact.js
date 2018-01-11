const keystone = require('keystone');
const Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {
	var newEnqury = new Enquiry.model();
	console.log('api/contact, req.body = ', req.body);
	newEnqury.set(req.body);
	newEnqury.save(function (err) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.json('Your enquiry was submitted');
		}
	});
};


