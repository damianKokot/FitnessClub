const router = require('express').Router();
const User = require('../../database/models/user');
const bcrypt = require('bcrypt');
const token = require('../token');

router.post('/', (req, res, next) => {
	User.getUserValues(['password'], req.body.email, (err, user) => {
		if (err) { return next(err); }
		if (!user) { return res.sendStatus(401); }
		bcrypt.compare(req.body.password, user.password, (err, valid) => {
			if (err) { return next(err); }
			if (!valid) { return res.sendStatus(401) }

			token(req.body.email, function (err, token) {
				if(err) { return next(err); };
				res.send(token);
			})
		});
	});
});

module.exports = router;