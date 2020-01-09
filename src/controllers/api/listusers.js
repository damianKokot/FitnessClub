const User = require('../../database/models/user');
const router = require('express').Router();

router.get('/', function(req, res, next){
	if(req.auth==null || req.auth.email==null){
		return res.sendStatus(401);
	}
	
	User.listUsers( function(err, user){
		if(err) { return next(err); }
		res.json(user);
	});
});


module.exports = router;