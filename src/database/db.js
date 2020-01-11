const mysql = require('mysql');
const config = require('../../config');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: config.db_password,
	database: 'FitnessClub'
});

connection.connect((err) => {
	if (err) {
		console.log("Mysql connection error\n");
		console.log(err);
	}
});

module.exports = connection;