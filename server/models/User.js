//User.js source code
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['user', 'admin'],  // 'user' болон 'admin' гэсэн утгууд байх болно
        default: 'user'  // Хэрэв хэрэглэгчийн роль тодорхойлогдоогүй бол 'user' утгыг ашиглана
    }
}, { timestamps: true });  // timestamps нь хэрэглэгч үүссэн болон сүүлд шинэчлэгдсэн хугацааг автоматаар хадгална

const User = mongoose.model('User', userSchema);

module.exports = User;
