const moment = require("moment");

const catchAsync = require("../utils/catchAsync");
const { Pins } = require("../models");
const { pinsService } = require("../services");


const resetBookings = catchAsync( async(req,res)=>{
  const slots =  await Pins.find();
  let currentHour =  moment(new Date()).hour();
  for(var k=0;k<slots.length;k=k+1){
    const slot = await Pins.findOne({'_id':slots[k]._id});
    for(var i=0;i<slot.subcities.length;i=i+1){
      for(var j=0;j<slot.subcities[i].fast.slots.length;j=j+1){
        slot.subcities[i].fast.slots[j].isBooked = false;
      }
      for(var j=0;j<slot.subcities[i].normal.slots.length;j=j+1){
        slot.subcities[i].normal.slots[j].isBooked = false;
      }
    }
    await slot.save();
  }
  res.json({status:"booking reseted"});
});

const available = catchAsync(async(req,res)=>{
  const { code ,info} =  await pinsService.available();
  res.status(code).json(info);
})

const createPin =catchAsync(async(req,res)=>{
  const { code, info} = await pinsService.createPin(req.body);
  res.status(code).json(info);
})

const bookSlot = catchAsync(async(req,res)=>{
  const { email } =  req.cookies;
  console.log(email);
  console.log(req.body);
  const bb = req.body;
  bb.slotb=bb.slot;
  const { code, info } =  await pinsService.bookSlot(email,req.body);
  res.status(code).json(info);
})
module.exports = {resetBookings, available, createPin, bookSlot}