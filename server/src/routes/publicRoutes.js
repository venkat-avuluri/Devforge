const express = require('express');
const router = express.Router();
const {
  getPublicEvents,
  getPublicEventBySlug,
  registerForEvent,
  getMyRegistrations,
  checkMyRegistration,
} = require('../controllers/publicController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public event discovery
router.get('/events', getPublicEvents);
router.get('/events/:slug', getPublicEventBySlug);
router.post('/events/:slug/register', optionalAuth, registerForEvent);
router.get('/events/:slug/check-registration', protect, checkMyRegistration);

// Participant routes
router.get('/participant/registrations', protect, getMyRegistrations);

module.exports = router;
