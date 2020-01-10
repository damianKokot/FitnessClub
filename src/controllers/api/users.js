const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../../database/models/user');

router.get('/', function(req, res, next){
	User.getUserValues(['firstname', 'lastname', 'permissions'], req.auth.email, function(err, user){
		if(err) { return next(err); }
		res.json(user);
	});
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