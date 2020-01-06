const router = require('express').Router();
const Classes = require('../../database/models/specialClasses');

router.get('/', (req, res, next) => {
   Classes.getSpecificClass(req.auth.id, req.headers.name, (err, classes) => {
      if (err) { return next(err) }
      res.json(classes)
   });
});

router.put('/', (req, res, next) => {
   Classes.update(req.body, (err) => {
      if (err) { return next(err); }
      res.sendStatus(201);
   })
});

router.post('/', (req, res, next) => {
   Classes.save(req.body, (err) => {
      if (err) { return next(err); }
      res.sendStatus(201);
   })
});

module.exports = router;
