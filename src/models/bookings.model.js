const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    city:{type:String},
    subcity:{type:String},
    type:{type:String},
    slot:{type:Number},
    time:{type:String},
    cost:{type:Number,required:true}
  },
  {
    timestamps: true,
  }
);


const Bookings = mongoose.model('booking', bookingSchema);

module.exports = Bookings;
