const user =require("../models/user.model");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const getUserById = async (userId)=>{
    const userRecord = await user.findById(userId);
    if(!userRecord){
        throw new ApiError(httpStatus.status.NOT_FOUND,"User not found");
    }
    return userRecord;
}

const getUserByEmail = async (email)=>{
    const userRecord = await user.findOne({email});
    if(!userRecord){
        throw new ApiError(httpStatus.status.NOT_FOUND,"User not found");
    }
    return userRecord;
}

module.exports ={
    getUserById,
    getUserByEmail
}