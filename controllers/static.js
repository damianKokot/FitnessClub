let express = require('express');
let router = express.Router();

router.use(express.static(__dirname + '/../assets'));
router.get('/', (req, res)=>{
	res.sendfile('layouts/posts.html')
});

module.exports = router;