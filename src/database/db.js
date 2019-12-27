const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'rootadmin',
	database: 'FitnessClub'
});

connection.connect((err) => {
	if (err) {
		console.log("Mysql connection error\n");
		console.log(err);
	}
});

module.exports = connection;