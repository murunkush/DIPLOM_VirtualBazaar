const express = require('express');
const router = express.Router();
const { createDispute, resolveDispute } = require('../controllers/disputeController');  // disputeController-ийг зөв импортлох

// Dispute үүсгэх
router.post('/', createDispute);

// Dispute шийдвэрлэх
router.post('/resolve', resolveDispute);

module.exports = router;
