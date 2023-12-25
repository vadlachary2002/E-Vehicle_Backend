const express = require('express');
const { Pins, Bookings } = require('../models');
const { update } = require('../middlewares/bookings');
const { pinsController } = require('../controllers');

const router = express.Router();

router
  .route('/') 
  .get(update, pinsController.available)
  .post(pinsController.createPin)

router
  .route('/reset')
  .get(pinsController.resetBookings);

router
  .route('/book')
  .post(update,pinsController.bookSlot)

module.exports = router ;