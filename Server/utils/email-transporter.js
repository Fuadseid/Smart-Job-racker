const nodemailer = require('nodemailer')
const config = require('../configs/config');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:config.email,
        pass:config.emailpassword
    }
})

module.exports = transporter;