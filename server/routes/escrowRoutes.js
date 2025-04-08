const express = require('express');
const router = express.Router();
const { createEscrow, releaseEscrow } = require('../controllers/escrowController');

// Эскроу үүсгэх
router.post('/', createEscrow);

// Эскроу-ыг чөлөөлөх
router.post('/release', releaseEscrow);

module.exports = router;
