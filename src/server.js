const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(require('./auth'));

app.use('/', require('./controllers/static'));
app.use('/api/users', require('./controllers/api/users'));
app.use('/api/classes', require('./controllers/api/classes'))
app.use('/api/trainers', require('./controllers/api/trainers'))
app.use('/api/sessions', require('./controllers/api/sessions'));
app.use('/api/listusers', require('./controllers/api/listusers'))
app.use('/api/reservation', require('./controllers/api/reservations'))
app.use('/api/specialClasses', require('./controllers/api/specialClasses'))

app.listen(8080, function () {
	console.log('Server is listening on: ', 8080);
});