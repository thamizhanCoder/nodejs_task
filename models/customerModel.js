const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    mobile_no: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    profile_image: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date,
    }
});

module.exports = mongoose.model('Customer', customerSchema);
