const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const User = require('../../database/models/user');
const config = require('../../../config');

router.get('/', function(req, res, next){
	if(!req.headers['x-auth']){
		return res.send(401);
	}
	const auth = jwt.decode(req.headers['x-auth'], config.secret)
	User.getUserValues(['email', 'password'], auth.username, function(err, user){
		if(err) { return next(err); }
		console.log("User: ", user);
		res.json(user);
	});
});

router.post('/', function(req, res, next){
	bcrypt.hash(req.body.password, 10, function(err, hash){
		if(err) { return next(err); }
		
		User.save({
			email: req.body.username,
			password: hash
		}, (err) => {
			if(err) { return next(err); }
			res.send(201);
		})
	})
});


module.exports = router;