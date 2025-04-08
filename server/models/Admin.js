// models/Admin.js
const mongoose = require('mongoose');  // mongoose-г зөвхөн нэг удаа импортлох
const Schema = mongoose.Schema;  // Schema-г ялгаагүй нэршлээр ашиглах

const adminSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
