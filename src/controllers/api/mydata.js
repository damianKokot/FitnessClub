const User = require('../../database/models/user');
const router = require('express').Router();

router.get('/', function(req, res, next){
	if(req.auth==null || req.auth.email==null){
		return res.sendStatus(401);
	}
	
	User.getUserValues(['firstname', 'lastname', 'email', 'telephone'], req.auth.email, function(err, user){
		if(err) { return next(err); }
		res.json(user);
	});
});

router.put('/', (req, res, next) => {
	
	req.body.oldemail=req.auth.email;

	User.update(req.body, (err) => {
	   if (err) { return next(err); }
	   res.sendStatus(201);
	})
 });

module.exports = router;