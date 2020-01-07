const jwt = require('jwt-simple');
const config = require('../config');

module.exports = function(req, res, next){
	if(req.headers['x-auth']){
		req.auth = jwt.decode(req.headers['x-auth'], config.secret);
	} else {
		req.auth = { permissions: null };
	}
	const allowedSites = allowedSitesForUser(req.auth);
	
	if(allowedSites.includes(req.url)) {
		next();
	} else {
		console.log('Prem ', req.auth, ', url ', req.url, ', allowed ', allowedSites.includes(req.url));
		res.sendStatus(401);
	}
}

function allowedSitesForUser(auth) {
	const allowed = [
		'/',
		'/styles.css',
		'/app.js',
		'/favicon.ico',
		'/login.html',
		'/register.html',
		'/api/users',
		'/api/sessions'
	];
	if(auth === undefined) {
		return allowed;
	} else if (auth.permissions === 'admin') {
		return allowed.concat([
			'/classes/classes.html',
			'/api/classes',
			'/classes/classesEdit.html',
			'/classes/showSpecial.html',
			'/api/showSpecial',
			'/api/mydata',
			'/users/myinfo.html',
			'/users/editdata.html',
			'/api/editdata'
		]);
	} else if(auth.permissions === 'normal'){
		return allowed.concat([
			'/classes/classes.html',
			'/api/classes',
			'/classes/showSpecial.html',
			'/api/showSpecial',
			'/api/mydata',
			'/users/myinfo.html',
			'/users/editdata.html',
			'/api/editdata'
		]);
	} else {
		return allowed;
	}
}
