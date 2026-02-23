const { createContact, getAllConatcts, getContactById } = require("../services/contact.service");
const ApiError = require("../utils/ApiError");
const httpStatus = require('http-status');
const transporter = require("../utils/email-transporter");
const config = require("../configs/config");

const CreateConatctController = async (req,res)=>{
    const {name,email,message} = req.body;
    try{
        const contact = await createContact(req.body);
        const mailTo = await transporter.sendMail({
            from:email,
            to:config.email,
            subject:`New Contact Message from ${name}`,
            text:message
        })
        res.status(201).json({ message: "Contact created and email sent successfully", contact, mailTo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    CreateConatctController,
}