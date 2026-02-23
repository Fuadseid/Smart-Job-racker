const envVarSchema = require('../validation/envvarschema.validation');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

require('dotenv').config();

const {error,value}= envVarSchema.validate(process.env,{
    allowUnknown: true
});

if(error){
    throw new ApiError(httpStatus.status.BAD_REQUEST, `Config validation error: ${error.message}`);
}


module.exports = {
    port: value.PORT,
    dbConnection: value.DB_CONNECTION,
    nodeEnv: value.NODE_ENV,
    email:value.EMAIL,
    emailpassword:value.EMAIL_PASSWORD,
    jwt:{
        secret:value.JWT_SECRET,
        accessTokenExpiry:value.ACCESS_TOKEN_EXPIRY,
        refreshTokenExpiry:value.REFRESH_TOKEN_EXPIRY,
    },
    google:{
        clientId:value.GOOGLE_CLIENT_ID,
        clientSecret:value.GOOGLE_CLIENT_SECRET
    }
}