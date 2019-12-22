let express = require('express');
let router = express.Router();

router.use(express.static(__dirname + '/../www/assets'));
router.use(express.static(__dirname + '/../www/templates'));

router.get('/', (req, res)=>{
	res.sendfile('src/www/layouts/app.html')
});

module.exports = router;