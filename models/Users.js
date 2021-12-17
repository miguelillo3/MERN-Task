const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    nameuser: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    createDate: {
        type: Date,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Users', UserSchema);