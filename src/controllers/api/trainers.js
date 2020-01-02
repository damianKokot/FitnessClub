const router = require('express').Router();
const Trainer = require('../../database/models/trainer');

router.get('/', (req, res, next) => {
   Trainer.getTrainers((err, trainers) => {
      if (err) { return next(err) }
      res.json(trainers);
   });
});

module.exports = router;
