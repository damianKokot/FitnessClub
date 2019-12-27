const db = require('../db');

module.exports.getClassesValues = (args, next) => {
   const columns = Object.values(args).join(', ');
   db.query('SELECT ' + columns + ' FROM classes;', (err, data) => {
      next(err, data);
   });
};

module.exports.save = (data, next) => {
   db.query('INSERT INTO classes(name, description, duration) VALUES(?, ?, ?)', Object.values(data), next);
};
