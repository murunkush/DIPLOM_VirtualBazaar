const express = require('express');
const router = express.Router();
const { getAdminData, updateAdminData } = require('../controllers/adminController');  // adminController-ийг зөв импортлох

// Admin мэдээллийг авах
router.get('/', getAdminData);

// Admin мэдээллийг шинэчлэх
router.put('/', updateAdminData);

module.exports = router;
