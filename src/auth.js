const jwt = require('jwt-simple');
const config = require('../config');

module.exports = function(req, res, next){
	if(req.headers['x-auth']){
		req.auth = jwt.decode(req.headers['x-auth'], config.secret)
	}
	next();
}