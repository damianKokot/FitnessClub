const User = require('../../database/models/user');
const router = require('express').Router();

router.get('/', function(req, res, next){
	if(!req.headers['x-auth']){
		return res.sendStatus(401);
	}
	const auth = router.decode(req.headers['x-auth'], config.secret)
	User.getUserValues(['firstname', 'lastname', 'email', 'telephone'], auth.email, function(err, user){
		if(err) { return next(err); }
		res.json(user);
	});
});

module.exports = router;