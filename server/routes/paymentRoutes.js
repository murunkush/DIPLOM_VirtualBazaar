const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController'); // controller-ийг зөв хамааруулсан байна

// Төлбөр үүсгэх
router.post('/', paymentController.createPayment);

// Төлбөрийн мэдээлэл харах
router.get('/:id', paymentController.getPayment);

module.exports = router;
