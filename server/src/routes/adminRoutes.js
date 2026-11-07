const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getOrganizers,
  getParticipants,
  getAllEvents,
  toggleUserStatus,
  adminDeleteEvent,
  adminTogglePublish,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/organizers', getOrganizers);
router.get('/participants', getParticipants);
router.get('/events', getAllEvents);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/events/:id', adminDeleteEvent);
router.put('/events/:id/toggle-publish', adminTogglePublish);

module.exports = router;
