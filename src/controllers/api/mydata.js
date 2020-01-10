const User = require('../../database/models/user');
const router = require('express').Router();
const token = require('../token');


router.get('/', function(req, res, next){
	User.getUserValues(['firstname', 'lastname', 'email', 'telephone'], req.auth.email, function(err, user){
		if(err) { return next(err); }
		res.json(user);
	});
});

router.put('/', (req, res, next) => {
	req.body.oldEmail = req.auth.email;

	User.update(req.body, (err) => {
	   if (err) { return next(err); }
		
		token(req.body.email, (err, token) => {
			if(err) { return next(err); }
			res.send(token);
		});
	})
 });

module.exports = router;