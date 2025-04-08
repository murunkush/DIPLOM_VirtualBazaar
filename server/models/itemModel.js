const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Барааны нэр шаардлагатай']  
  },
  description: { 
    type: String 
  },
  price: { 
    type: Number, 
    required: [true, 'Үнэ заавал байх ёстой'], 
    min: [0, 'Үнэ эерэг тоо байх ёстой']  
  },
  game: { 
    type: String, 
    required: [true, 'Тоглоомын нэр шаардлагатай']  
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Худалдагчийн мэдээлэл шаардлагатай']  
  },
  imageUrls: { 
    type: [String], // Multiple image URLs field
    required: [true, 'Зураг заавал байх ёстой']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  deletedAt: { 
    type: Date 
  }  
});

// Item model үүсгэж байна
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
