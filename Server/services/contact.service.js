const Contact = require("../models/contact.models");

const createContact = async (contactData) => {
  try {
    const contact = await Contact.create(contactData);
    return contact;
  } catch (error) {
    throw new ApiError(httpStatus.status.INTENAL_SERVER_ERROR, "Failed to create contact");
  }
};


const getAllConatcts = async ()=>{
    try {
        const contacts = await Contact.find();
        return contacts;
    } catch (error) {
        throw new ApiError(httpStatus.status.INTENAL_SERVER_ERROR, "Failed to fetch contacts");
    }
}

const getContactById = async (contactId)=>{
    try {
        const contact = await Contact.findById(contactId);
        if(!contact){
            throw new ApiError(httpStatus.status.NOT_FOUND, "Contact not found");
        }       
        return contact;
    } catch (error) {
        throw new ApiError(httpStatus.status.INTENAL_SERVER_ERROR, "Failed to fetch contact");
    }
}   

module.exports = {
    createContact,
    getAllConatcts,
    getContactById
}