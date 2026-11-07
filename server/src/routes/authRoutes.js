const express = require('express');
const router = express.Router();
const {
  registerOrganizer,
  login,
  requestParticipantOTP,
  verifyParticipantOTP,
  getMe,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public auth routes
router.post('/register', registerOrganizer);
router.post('/login', login);
router.post('/participant/request-otp', requestParticipantOTP);
router.post('/participant/verify-otp', verifyParticipantOTP);

// Protected auth routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
