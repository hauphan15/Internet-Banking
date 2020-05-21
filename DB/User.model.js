const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    money: Number,
    email: String,
    password: String
});

module.exports = mongoose.model('User', UserSchema);