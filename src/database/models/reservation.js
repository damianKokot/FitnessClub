const db = require('../db');

module.exports.assign = (userEmail, classId, next) => {
   db.query('CALL assignUser(?, ?)', [userEmail, classId], (err, data) => {
      next(err, data);
   });
};
   
module.exports.unAssign = (userEmail, classId, next) => {
   db.query('CALL unAssignUser(?, ?)', [userEmail, classId], (err, data) => {
      next(err, data);
   });
};
