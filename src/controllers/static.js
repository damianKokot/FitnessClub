const express = require('express');
const router = express.Router();
const path = require('path');

router.use(express.static(__dirname + '/../www/assets'));
router.use(express.static(__dirname + '/../www/templates'));

router.get('/', (req, res)=>{
	res.sendFile('src/www/layouts/app.html', {root: path.join(__dirname, '../../')});
});

module.exports = router;