const express = require('express');
const userRoute = require('./user.route');
const testRoute =  require('./test.route');
const pinsRoute =  require('./pins.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/test',
    route: testRoute,
  },
  {
    path: '/pins',
    route: pinsRoute
  },
  
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
