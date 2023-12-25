const express = require('express');
const { User } = require('../models');

const router = express.Router();

router
  .route('/') 
  .get(async(req,res)=>{
    res.json({status:"success test route"});
  })
router
  .route('/get')
  .get(async(req,res)=>{
    const users =  await User.find();
    res.status(200).json({status:"success users test",users});
  })

module.exports = router ;