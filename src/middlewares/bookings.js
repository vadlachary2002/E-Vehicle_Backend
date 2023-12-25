const { Pins } = require('../models');
const moment = require('moment');

const update = async (req,res,next)=>{
  const slots =  await Pins.find();
  let currentHour =  moment(new Date()).hour();
  for(var k=0;k<slots.length;k=k+1){
    const slot = await Pins.findOne({'_id':slots[k]._id});
    for(var i=0;i<slot.subcities.length;i=i+1){
      for(var j=0;j<slot.subcities[i].fast.slots.length;j=j+1){
        if(currentHour>=slot.subcities[i].fast.slots[j].timeout){
          slot.subcities[i].fast.slots[j].isBooked = false;
        }
      }
      for(var j=0;j<slot.subcities[i].normal.slots.length;j=j+1){
        if(currentHour>=slot.subcities[i].normal.slots[j].timeout){
          slot.subcities[i].normal.slots[j].isBooked = false;
        }
      }
    }
    await slot.save();
  }
  next();
}


module.exports = { update}