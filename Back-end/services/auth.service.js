const user =require("../models/user.model");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { verifyToken, generateAuthToken } = require("./token.service");
const { tokenTypes } = require("../configs/token");
const { getUserById } = require("./user.service");


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
    if(!Userrecord|| !(await Userrecord.isPasswordMatch(password))){
        throw new ApiError(httpStatus.status.UNAUTHORIZED,"Invalid email or password")
    }
    return Userrecord;
}
const refreshToken = async (refreshtoken) => {
  const refreshTokenDoc = await verifyToken(refreshtoken, tokenTypes.REFRESH);
  const user = await getUserById(refreshTokenDoc.user);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  await refreshTokenDoc.deleteOne();
  return generateAuthToken(user);
};


module.exports = {
    registerUser,
    loginUser,
    refreshToken
}
