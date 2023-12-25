const { Pins, Bookings } = require("../models")
const moment = require("moment");

const available = async()=>{
  const avail =  await  Pins.find();
  return {
    code:200,
    info:{
      available:avail
    }
  }
}

const createPin = async(pinBody)=>{
  const pins = await Pins.create(pinBody);
  return {
    code:201,
    info:{
      pins
    }
  }
}

const bookSlot =  async(email,bookBody)=>{
    const { city, subcity, type, slotb,cost} = bookBody;
    console.log("email",email)
    const slot =  await Pins.findOne({city});
    console.log("lot",slot);
    let currentHour =  moment(new Date()).hour();
    let booked=null;
    for(var i=0;i<slot.subcities.length;i=i+1){
      if(slot.subcities[i].name===subcity){
        for( var j=0;j<slot.subcities[i][type].slots.length;j=j+1){
          console.log(slot.subcities[i][type].slots[j].slot,slotb,slot.subcities[i][type].slots[j].slot==slotb);
          if(slot.subcities[i][type].slots[j].slot==slotb){
            console.log("cameeeee",slot.subcities[i][type].slots[j].isBooked);
            if(slot.subcities[i][type].slots[j].isBooked==true){
              return { code:401,info:{message:"failed to book ,already booked"}}
            }else if(currentHour>slot.subcities[i][type].slots[j].timeout-1){
              return { code:401,info:{message:"failed to book ,unable to book outdated slot"}}
            }else{
              booked=slot.subcities[i][type].slots[j];
              slot.subcities[i][type].slots[j].isBooked=true;
              break;
            }
          }
        }
      }
    }
    await slot.save();
    if(!booked){
      return {
        code:401,
        info:{message:"Internal Server error"}
      }
    }
    console.log(booked);
    const bookingBody = { email, city, subcity, type, slot:booked.slot,time:booked.time,cost};
    const booking =  await Bookings.create(bookingBody);
    return {
      code:201,
      info:{message:"Slot Booked",booking}
    }
}
module.exports = { available, createPin, bookSlot}