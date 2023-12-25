const  jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const config = require("../config/config");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

const authenticate = catchAsync(async (req, res, next) => {
  const { jwtoken, email } = req.cookies;
  if(!jwtoken) throw new ApiError(401,'token does not exist or expired');
  await jwt.verify(jwtoken,config.jwtkey,async (err,token) => {
    if(err) throw new ApiError(401,'invalid token');
    const existingUser = await User.findOne({email : token.email});
    if(!existingUser) {
      res.clearCookie('jwtoken');
      throw new ApiError(401,'user does not exist');
    } 
    if(email!=token.email) throw new ApiError(401,'unauthorised user');
    next();
  })
});
module.exports = authenticate;