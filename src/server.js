const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(require('./auth'));

app.use('/', require('./controllers/static'));
app.use('/api/sessions', require('./controllers/api/sessions'));
app.use('/api/users', require('./controllers/api/users'));
app.use('/api/classes', require('./controllers/api/classes'));
app.use('/api/mydata', require('./controllers/api/mydata'));
app.use('/api/showSpecial', require('./controllers/api/specialClasses'))
app.use('/api/trainers', require('./controllers/api/trainers'))



app.listen(8080, function () {
	console.log('Server is listening on: ', 8080);
});