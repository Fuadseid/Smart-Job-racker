const joi = require('joi');

const envVarSchema = joi.object({
    DB_CONNECTION: joi.string().required(),
    PORT: joi.number().required().default(5000),
    NODE_ENV: joi.string().valid('development', 'production', 'test').required()
})
module.exports = envVarSchema;