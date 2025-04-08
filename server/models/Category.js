// models/Category.js
const mongoose = require('mongoose');  // mongoose-г зөвхөн нэг удаа импортлох
const Schema = mongoose.Schema;  // Schema-г ялгаагүй нэршлээр ашиглах

const categorySchema = new Schema({
    name: { type: String, required: true }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
