const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../../database/models/user');
const token = require('../token');

router.get('/', function(req, res, next){
	User.getUserValues(['firstname', 'lastname', 'email', 'telephone', 'permissions'], req.headers.email, function (err, user) {
		if (err) { return next(err); }
		res.json(user);
	});
});

router.put('/', (req, res, next) => {
	User.update(req.body, (err) => {
		if (err) { return next(err); }

		if(req.auth.email === req.body.oldEmail) {
			token(req.body.email, (err, token) => {
				if (err) { return next(err); }
				res.send(token);
			});
		} else {
			res.send(req.headers['x-auth']);
		}
	})
});

router.post('/', function(req, res, next){
	bcrypt.hash(req.body.password, 10, function(err, hash){
		if(err) { return next(err); }
		req.body.password = hash;

		User.save(req.body, (err) => {
			if(err) { return next(err); }
			res.sendStatus(201);
		})
	})
});


module.exports = router;