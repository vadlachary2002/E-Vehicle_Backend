const config = require("../config/config");
const { User, Account, Bookings } = require("../models")
const bcryptjs = require('bcryptjs');
const jwt  = require("jsonwebtoken");

const register = async (userBody)=>{
  const { email, password } =  userBody;
  const isEmailExist = await User.isEmailTaken(email);
  if(isEmailExist){
    return {
      code:401,
      info:{
        message:"Email already exist",
      },
    }
  }
  const hashedPassword = await bcryptjs.hash(password,10);
  userBody.password =  hashedPassword;
  const user = await User.create(userBody);
  if(!user){
    return {
      code:400,
      info:{
        message:"Something went wrong",
      }
    }
  }
  console.log("created",user);
  return {
    code:200,
    info:{
      message:"User Node Created Succesfully",
    }
  }

}
const logout =  async (email)=>{
  const exsistingUser = await User.findOne({email});
  if(!exsistingUser){
    return {
      code:401,
      info:{
        message:"User does not exist",
      }
    }
  }
  exsistingUser.online = false;
  await exsistingUser.save();
  return {
    code:200,
    info:{
      message:"User logged out"
    }
  }
}
const login =  async (userBody)=>{
  const { email, password } = userBody;
  const exsistingUser = await User.findOne({email});
  console.log(userBody,exsistingUser);
  if(!exsistingUser){
    return {
      code:401,
      info:{
        message:"User does not exist",
      }
    }
  }
  console.log()
  const validatePassword = await bcryptjs.compare( password, exsistingUser.password);
  console.log(validatePassword);
  if(!validatePassword){
    return {
      code:400,
      info:{
        message:"Incorrect password"
      }
     };
  }
  const isAdmin =  await User.isAdmin(exsistingUser.email);
  const token = jwt.sign({email : exsistingUser.email },config.jwtkey);
  exsistingUser.online =  true;
  await exsistingUser.save();
  return {
    code:200,
    info:{
      message:"Successfully Logged In",
      isAdmin,
      email:exsistingUser.email,
      token
    }
  }
}


const updatePassword = async(userBody)=>{
  const { email, oldPassword, newPassword } =  userBody;
  const exsistingUser = await User.getUser(email);
  if(!exsistingUser){
    return {
      code:401,
      info:{
        message:"User Does Not Exist",
      }
    }
  }
  const matchPassword = await bcryptjs.compare(oldPassword,exsistingUser.password);
  if(!matchPassword){
    return {
      code:400,
      info:{
        message:"Incorrect password"
      }
     };
  }
  const hashedPassword = await bcryptjs.hash(newPassword,10);
  const updatedUser = await User.updateOne({email},{$set:{password:hashedPassword}});
  if(!updatedUser){
    return {
      code:400,
      info:{
        message:"Something went wrong",
      }
    }
  }
  return {
    code:200,
    info:{
      message:"Updated password succesfully",
    }
  }
}

const getBookingsByUser = async (email)=>{
  const bookings = await Bookings.find({email});
  return {
    code:200,
    info:{
      bookings
    }
  }
}
module.exports = { register, logout ,login, updatePassword, getBookingsByUser}