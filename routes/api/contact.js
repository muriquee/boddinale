const keystone = require('keystone');
const Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {
	console.log('api/contact, req.body = ', req.body);
	var newEnqury = new Enquiry.model({
		name: req.body.name,
		email: req.body.email,
		enquiryType: req.body.enquiryType,
		message: req.body.message,
	});
	newEnqury.save(function (err) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.json('Your enquiry was submitted');
		}
	});
};


