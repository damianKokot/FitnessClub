const db = require('../db');

module.exports.getSpecificClass = (className, next) => {
   const query = 'SELECT c.name AS className, c.description AS classDescription, ' +
   'u.firstname AS trainerName, start, max_participants, empty_places ' + 
   'FROM specific_classes AS s ' +
   'INNER JOIN classes AS c ON c.id = s.class_id ' + 
   'INNER JOIN trainers AS t ON s.trainer_id = t.id ' + 
   'INNER JOIN users AS u ON t.id = u.id';

   console.log("classname", className);
   db.query(query, (err, data) => {
      next(err, data);
   });
};

module.exports.save = (data, next) => {
   db.query('INSERT INTO speciffic_classes(name, description, duration) VALUES(?, ?, ?)', Object.values(data), next);
};