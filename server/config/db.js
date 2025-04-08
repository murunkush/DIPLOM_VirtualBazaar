const mongoose = require('mongoose');
require('dotenv').config(); // .env файлыг унших

// MongoDB холболт
const connectDB = async () => {
  try {
    // MongoDB URI ашиглан холболт хийх
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, // Индексуудыг автоматаар үүсгэх
      useFindAndModify: false, // findAndModify-ийг хуучин хувилбараар ашиглахгүй
    });
    console.log('MongoDB холбогдлоо');
  } catch (err) {
    // Алдаа гарсан тохиолдолд серверийг зогсоох
    console.error('MongoDB холболт амжилтгүй', err);
    process.exit(1); // Хэрэв алдаа гарвал серверийг зогсооно
  }
};

module.exports = connectDB;
