const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '12345',
	database: 'FitnessClub'
});

connection.connect((err) => {
	if (err) {
		console.log("Mysql connection error\n");
		console.log(err);
	}
});

module.exports = connection;