const router = require('express').Router();
const User = require('../../database/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const config = require('../../../config');

router.post('/', (req, res, next) => {
	User.getUserValues(['password'], req.body.email, (err, user) => {
		if (err) { return next(err); }
		if (!user) { return res.send(401); }
		bcrypt.compare(req.body.password, user.password, (err, valid) => {
			if (err) { return next(err); }
			if (!valid) { return res.send(401) }
			res.send(jwt.encode({ email: req.body.email }, config.secret));
		});
	});
});

module.exports = router;