const db = require('../db');

module.exports.getSpecificClass = (className, next) => {
   db.query('CALL getSpecificClass(?)', [className], (err, data) => {
      next(err, data);
   });
};

module.exports.update = function(data, next) {
   console.log(data);
   //db.query('INSERT INTO specific_classes SET (name, description, duration) VALUES(?, ?, ?)', Object.values(data), next);
}

module.exports.save = function(data, next) {
   db.query('INSERT INTO specific_classes(name, description, duration) VALUES(?, ?, ?)', Object.values(data), next);
};
