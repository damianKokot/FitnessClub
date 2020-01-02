const router = require('express').Router();
const Classes = require('../../database/models/specialClasses');

router.get('/', (req, res, next) => {
   Classes.getSpecificClass(req.body, (err, classes) => {
      if (err) { return next(err) }
      res.json(classes)
   });
});

router.post('/', (req, res, next) => {
   Classes.save(req.body, (err) => {
      if (err) { return next(err); }
      res.sendStatus(201);
   })
});

module.exports = router;
