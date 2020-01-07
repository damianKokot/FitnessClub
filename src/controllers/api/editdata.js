const router = require('express').Router();
const Classes = require('../../database/models/class');

router.get('/', (req, res, next) => {
 //  Classes.getClassesValues(['firstname', 'lastname', 'email', 'telephone'], (err, classes) => {
     // if (err) { return next(err) }
      res.json({"firstname":"TEST", "lastname": "TEST", "email":"TEST", "telephone":"11111111"})
   //});
});

router.post('/', (req, res, next) => {
   Classes.save(req.body, (err) => {
      if (err) { return next(err); }
      res.sendStatus(201);
   })
});

module.exports = router;
