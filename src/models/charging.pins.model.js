const mongoose = require('mongoose');

const chargingSchema = mongoose.Schema(
  {
    city:{type:String},
    available:{ type:Number},
    subcities:[
      {
        name:{type:String},
        available:{type:Number},
        fast:{
          cost:{type:Number},
          slots:[
            {
              slot:{type:Number},
              time:{type:String},
              isBooked:{type:Boolean},
              timeout:Number,
            }
          ]
        },
        normal:{
          cost:{type:Number},
          slots:[
            {
              slot:{type:Number},
              time:{type:String},
              isBooked:{type:Boolean},
              timeout:Number,
            }
          ]
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);


const Pins = mongoose.model('Pins', chargingSchema);

module.exports = Pins;
