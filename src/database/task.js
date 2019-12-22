const db = require('db');

const task = function (task) {
   this.task = task.task;
   this.status = task.status;
   this.created_at = new Date();
};

task.select(...args => {
   this._select = args;
});

task.from(table => {
   this._from = table;
});

task.where(...args => {
   this._where = args;
});

task.orderBy((arg, direction) => {
   this._orderBy = arg;
   this._direction = direction;
});

task.exec(next => {
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

   if (this._where) {
      query += " WHERE " + this._where.join(" AND ");
   }

   if(this._orderBy) {
      query += " ORDER BY " + this._orderBy;
      if(this._direction) {
         query += " " + this._direction;
      }
   }

   db.query(query, )


});

