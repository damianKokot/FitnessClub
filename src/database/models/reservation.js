const db = require('../db');

module.exports.getReservations = (userEmail, next) => {
   const query = 'SELECT specific_class_id ' + 
      'FROM reservations AS r ' + 
      'INNER JOIN users AS u ON r.user_id=u.id ' +
      'WHERE u.email=?';
   db.query(query, [userEmail], (err, data) => {
      next(err, data);
   });
};

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
