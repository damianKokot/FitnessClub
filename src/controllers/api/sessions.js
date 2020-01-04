const router = require('express').Router();
const User = require('../../database/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const config = require('../../../config');

router.post('/', (req, res, next) => {
	User.getUserValues(['password', 'permissions', 'id'], req.body.email, (err, user) => {
		if (err) { return next(err); }
		if (!user) { return res.sendStatus(401); }
		bcrypt.compare(req.body.password, user.password, (err, valid) => {
			if (err) { return next(err); }
			if (!valid) { return res.sendStatus(401) }
			res.send(jwt.encode({ email: req.body.email, permissions: user.permissions, id: user.id }, config.secret));
		});
	});
});

module.exports = router;