const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const dayjs = require("dayjs");
const configs = require("../configs/config");
const { tokenTypes } = require("../configs/token");
const Token =require("../models/token.model")


const saveToken = async (token,userId,expires,type,blacklisted=false)=>{
    const tokenDoc = await Token.create({
        token,
        user:userId,
        expires:expires,
        type,
        blacklisted,
    });
    return tokenDoc;
}

const verifyToken = async (token,type)=>{
    const payload = jwt.verify(token,config.jwt.secret);
    const tokenDoc = await token.findOne({
        token,
        user: payload.sub,
        type,
        blacklisted:false,
    });
    if(!tokenDoc){
        throw new Error("Token not found");
    }
    return tokenDoc;
}

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: dayjs().unix(),
    exp: dayjs().add(expires, "seconds").unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const generateAuthToken = async (userId) => {
  const accesstokenExpires = dayjs()
    .add(configs.jwt.accessTokenExpiry, "seconds")
    .unix();
  const refreshTokenExpires = dayjs()
    .add(configs.jwt.refreshTokenExpiry, "seconds")
    .unix();
   

  const accessToken = generateToken(
    userId,
    accesstokenExpires,
    tokenTypes.ACCESS,
  );
  const refreshToken = generateToken(
    userId,
    refreshTokenExpires,
    tokenTypes.REFRESH,
  );
   await saveToken(refreshToken, userId, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accesstokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

module.exports = {
    generateToken,
    generateAuthToken,
    saveToken,
    verifyToken,

}
