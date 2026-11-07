const express = require('express');
const router = express.Router();
const {
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  publishEvent,
  unpublishEvent,
  getEventRegistrations,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

// All event routes are protected for Organizers and Admins
router.use(protect);
router.use(authorize('organizer', 'admin'));

router.route('/')
  .post(createEvent)
  .get(getMyEvents);

router.route('/:id')
  .get(getEventById)
  .put(updateEvent)
  .delete(deleteEvent);

router.post('/:id/publish', publishEvent);
router.post('/:id/unpublish', unpublishEvent);
router.get('/:id/registrations', getEventRegistrations);

module.exports = router;
