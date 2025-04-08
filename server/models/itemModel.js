const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Барааны нэр шаардлагатай']  // Хэрэглэгчээс барааны нэрийг шаардах
  },
  description: { type: String },
  price: { 
    type: Number, 
    required: [true, 'Үнэ заавал байх ёстой'], 
    min: [0, 'Үнэ эерэг тоо байх ёстой']  // Үнэ нь 0-с их байх ёстой
  },
  game: { 
    type: String, 
    required: [true, 'Тоглоомын нэр шаардлагатай']  // Хэрэглэгчээс тоглоомын нэрийг шаардах
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Худалдагчийн мэдээлэл шаардлагатай']  // Худалдагчийн ID-г оруулах
  },
  imageUrl: { type: String },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  deletedAt: { 
    type: Date 
  }  // Барааг устгасан огноо
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
