const express = require('express');
const { userController } = require('../controllers');
const authenticate = require('../middlewares/authenticate');
const { User } = require('../models');

const router = express.Router();

router
  .route('/') 
  .get(async (req,res)=>{
    const users =  await User.find();
    res.status(200).json(users);
  })

router
  .route('/register')
  .post(userController.register);

router
  .route('/login')
  .post(userController.login);  

router
  .route('/logout')
  .post(userController.logout);

router
  .route('/bookings')
  .get(userController.getBookingsByUser);

module.exports = router ;