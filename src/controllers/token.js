const User = require('../database/models/user');
const jwt = require('jwt-simple');
const config = require('../../config');

module.exports = function(email, next) {
   User.getUserValues(['permissions', 'id'], email, (err, user) => {
      const token = jwt.encode({ 
         email: email, 
         permissions: user.permissions, 
         id: user.id 
      }, config.secret);
      next(err, token);
   });
}