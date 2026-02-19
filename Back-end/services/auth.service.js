const user =require("../models/user.model");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");


const registerUser = async (userData)=>{
    const userExists = await user.isEmailTaken(userData.email);
    if(userExists){
        throw new ApiError(httpStatus.status.CONFLICT, "Email already taken");
    }
    const newUser = await user.create(userData);
    return newUser;
}

const loginUser = async (email,password)=>{
    const Userrecord = await user.findOne({email});
    if(!Userrecord){
        throw new ApiError(httpStatus.status.UNAUTHORIZED,"Invalid email or password")
    }
}

module.exports = {
    registerUser,
    loginUser,
}
