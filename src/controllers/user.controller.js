const config = require("../config/config");
const moment = require("moment");
const { userService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync (async (req,res)=>{
  const { code, info } = await userService.register(req.body);
  res.status(code).json(info);
})
const login = catchAsync (async(req,res)=>{
  const { code, info } = await userService.login(req.body);
  const options = {
    expires: new Date(moment (Date.now()).add(config.tokenExpiryDays,'days')),
    httpOnly: false,
    secure: false,
  }
  const { email, token } =  info;
  res
    .cookie('email',email,{httpOnly:false})
    .cookie('jwtoken',token,{httpOnly:false})
    .status(code).json(info);
})

const logout = catchAsync(async(req,res)=>{
  const { jwtoken, email } = req.cookies;
  const { code, info} =  await userService.logout(email);
  email && res.clearCookie('email',{path:'/'});
  jwtoken && res.clearCookie('jwtoken',{path:'/'});
  res.status(code).json(info);
})

const updatePassword = catchAsync(async(req,res)=>{
  const { code, info } =  await userService.updatePassword(req.body);
  res.status(code).json(info);
})

const getBookingsByUser = catchAsync(async (req,res)=>{
  const { email } =  req.cookies;
  const { code, info } = await userService.getBookingsByUser(email);
  res.status(code).json(info);
})
module.exports = { register, login, updatePassword, logout, getBookingsByUser }