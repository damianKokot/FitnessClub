const router = require('express').Router();
const Reservation = require('../../database/models/reservation');

router.get('/', (req, res, next) => {
   Reservation.getReservations(req.auth.email, (err, data) => {
      if (err) { return next(err) }
      res.json(data)
   })
});

router.post('/', (req, res, next) => {
   if(req.body.action === "assign") {
      Reservation.assign(req.auth.email, req.body.classId, (err, status) => {
         if (err) { return next(err) }
         res.json(status)
      });
   } else if (req.body.action === "unAssign") {
      Reservation.unAssign(req.auth.email, req.body.classId, (err, status) => {
         if (err) { return next(err) }
         res.json(status)
      });
   } else {
      next("Not recognized!");
   }
});

module.exports = router;
