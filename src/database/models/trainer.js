const db = require('../db');

module.exports.getTrainers = (next) => {
   const query = 'SELECT u.id, CONCAT(u.firstname, " ", u.lastname) AS name, t.description ' +
   'FROM trainers AS t ' +
   'INNER JOIN users AS u ON u.id = t.id;';
   db.query(query, (err, data) => {
      next(err, data);
   });
};
