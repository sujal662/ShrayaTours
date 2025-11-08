const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Public routes
router.post('/login', adminController.login);

// Protected routes (would need authentication middleware in production)
router.post('/change-password', adminController.changePassword);
router.get('/verify', adminController.verifyToken);

module.exports = router;
