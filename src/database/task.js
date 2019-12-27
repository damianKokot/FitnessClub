module.exports.newQuery = () => {
   this.select = null;
   this._from = null;
}

module.exports.select = (...args) => {
   this._select = args;
};

module.exports.from = (table) => {
   this._from = table;
};

module.exports.where = ()


function buildQuery() {
   const query = "SELECT ";

   if(this._select) {
      query += this._select.join(", ");
   } else {
      query += "*";
   }

   if (this._from) {
      query += " FROM " + _from;
   } else {
      throw "Database query exception: Table from not selected";
   }

   return query;
};

module.exports.exec = (next) => {
   db.query('SELECT ' + columns + ' FROM users WHERE email = ?;', [email], (err, data) => {
      if (data)
         data = data[0];
      next(err, data);
   });
}