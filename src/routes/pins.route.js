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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomTimeSlot(slotNum) {
  // Generate a random start hour (9 AM to 9 PM)
  const startHour = getRandomInt(9, 21);
  // Format time string, with 1-hour duration
  const to12Hour = (h) => {
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:00${suffix}`;
  };
  const startTime = to12Hour(startHour);
  const endTime = to12Hour(startHour + 1);
  return {
    slot: slotNum,
    time: `${startTime}-${endTime}`,
    isBooked: Math.random() < 0.5,  // random true/false
    timeout: getRandomInt(10, 22),
  };
}

function generateSlots(numSlots) {
  const slots = [];
  const usedHours = new Set();
  let slotNum = 1;
  while (slots.length < numSlots) {
    const startHour = getRandomInt(8, 23);
    if (!usedHours.has(startHour)) {
      usedHours.add(startHour);
      slots.push(generateRandomTimeSlot(slotNum));
      slotNum++;
    }
  }
  return slots;
}

function generateSubcity(name) {
  return {
    name,
    available: getRandomInt(5, 20),
    fast: {
      cost: getRandomInt(80, 120),
      slots: generateSlots(getRandomInt(3, 7))
    },
    normal: {
      cost: getRandomInt(50, 80),
      slots: generateSlots(getRandomInt(4, 10))
    }
  };
}

function generateCity(name, numSubcities) {
  const subcities = [];
  for (let i = 0; i < numSubcities; i++) {
    subcities.push(generateSubcity(`${name}-Subcity${i + 1}`));
  }
  return {
    city: name,
    available: getRandomInt(10, 20),
    subcities,
  };
}

function generateData(numCities, maxSubcitiesPerCity) {
  const cities = [];
  for (let i = 0; i < numCities; i++) {
    cities.push(generateCity(`City${i + 1}`, getRandomInt(2, maxSubcitiesPerCity)));
  }
  return cities;
}

router
  .route('/set')
  .get(async (req,res) => {
    const data = generateData(5,4);

    const re = []
    for( const each of data) {
      const v = await Pins.create(each);
      re.push(v);
    }
    return res.json({status: true, data: re})
  })

module.exports = router ;
