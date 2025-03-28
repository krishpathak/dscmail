const mongoose = require('mongoose');
const { Schema } = mongoose;

const mailSchema = new Schema({
    mail_sender: {
        type: String,
        required: true
    },
    mail_reciever: {
        type: String,
        required: true
    },
    subject:{
        type:String,
        required:true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Mail = mongoose.model('Mail', mailSchema);

module.exports = Mail;
