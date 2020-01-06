const db = require('../db');

module.exports.getSpecificClass = (userId, className, next) => {
   const query = 'SELECT s.id, t.id AS trainerId, CONCAT(u.firstname, " ", u.lastname)  AS trainerName, ' +
      't.description AS trainerDescription, ' +
      's.start, ' +
      's.end, ' +
      's.max_participants, ' +
      's.reserved_places, ' +
      's.id IN( ' +
         'SELECT r.specific_class_id  ' +
         'FROM reservations AS r  ' +
         'INNER JOIN specific_classes AS s ON s.id = r.specific_class_id ' +
         'WHERE r.user_id = ?) AS reserved ' +
      'FROM specific_classes AS s ' +
      'INNER JOIN classes AS c ON c.id = s.class_id ' +
      'INNER JOIN trainers AS t ON s.trainer_id = t.id ' +
      'INNER JOIN users AS u ON t.id = u.id ' +
      'WHERE c.name = ?;';
   
   db.query(query, [userId, className], (err, data) => {
      next(err, data);
   });
};

module.exports.update = function(data, next) {
   const query = 'UPDATE specific_classes ' +
      'SET trainer_id = ?, class_id = (SELECT id FROM classes WHERE name = ?), start = ?, max_participants = ? ' +
      'WHERE id = ?;';
   db.query(query, Object.values(data), next);
}

module.exports.save = function(data, next) {
   db.query('INSERT INTO specific_classes(trainer_id, class_id, start, max_participants) VALUES(?, ?, ?, ?);', Object.values(data), next);
};

