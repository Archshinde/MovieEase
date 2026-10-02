const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    otp: {
        type: Number,
        required: false  
    },
    otpExpiry: {
        type: Date,
        required: false  
    },
    verified: {
        type: Boolean,
        default: false 
    },
    createdAt: {
        type: Date,
        default: Date.now  
    }
},
{
    timestamps: true
});

const User = mongoose.model("userLLDMarch", userSchema);
module.exports = User;
