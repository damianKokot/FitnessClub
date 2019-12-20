const sql = require('../db');

const Task = function (task) {
	this.task = task.task;
	this.status = task.status;
	this.created_at = new Date();
};

Task.getAllUsers = (result) => {
	sql.query("Select * from users", function (err, res) {
		if (err) {
			result(err, null)
		} else {
			result(null, res);
		}
	});
}


module.exports = Task;