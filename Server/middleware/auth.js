const   passport = require('passport')
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status').status
const verifyCallback =(req,resolve,reject)=>async(error,user,info)=>{
    if(error||info||!user){
        return reject( new ApiError(httpStatus.UNAUTHORIZED,'Please authenticate'))
    }
    req.user = user;
    resolve()


}
const auth = async(req,res,next)=>{
    return new Promise((resolve,reject)=>{
        passport.authenticate('jwt',session=false,verifyCallback(req,resolve,reject))(req,res,next)
    }).then(()=>next()).catch((error)=>next(error));
}

module.exports = auth