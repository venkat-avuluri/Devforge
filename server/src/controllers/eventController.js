const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Helper to check ownership
const checkEventOwnership = (event, userId, userRole) => {
  if (userRole === 'admin') return true;
  return event.owner.toString() === userId.toString();
};

// @desc Create a new event
// @route POST /api/events
// @access Private (Organizer/Admin)
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      tagline,
      description,
      category,
      date,
      endDate,
      time,
      venue,
      organizer,
      contact,
      template,
      theme,
      heroImage,
      sections,
      status,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Event title is required' });
    }

    const event = new Event({
      owner: req.user._id,
      title,
      tagline: tagline || '',
      description: description || 'Exciting college event hosted on DevForge.',
      category: category || 'Technical Fest',
      date: date || new Date().toISOString().split('T')[0],
      endDate: endDate || '',
      time: time || '09:00 AM - 05:00 PM',
      venue: venue || 'Campus Auditorium',
      organizer: organizer || req.user.college || req.user.name,
      contact: contact || {
        email: req.user.email,
        phone: req.user.phone || '',
        name: req.user.name,
      },
      template: template || 'modern',
      theme: theme || { primaryColor: '#4f46e5', accentColor: '#06b6d4', darkMode: false },
      heroImage:
        heroImage ||
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80',
      sections: sections || {
        about: {
          title: `About ${title}`,
          content: description || 'Detailed overview of the event.',
          highlights: ['Keynote Addresses', 'Competitive Challenges', 'Networking Opportunities'],
        },
        schedule: [],
        speakers: [],
        sponsors: [],
        gallery: [],
        faqs: [],
      },
      status: status || 'draft',
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all events owned by current user (or all if admin)
// @route GET /api/events
// @access Private (Organizer/Admin)
const getMyEvents = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.owner = req.user._id;
    }

    const events = await Event.find(query).sort({ createdAt: -1 });

    // Populate registration counts for each event
    const eventIds = events.map((e) => e._id);
    const regCounts = await Registration.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: '$event', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    regCounts.forEach((r) => {
      countMap[r._id.toString()] = r.count;
    });

    const eventsWithCounts = events.map((event) => {
      const eObj = event.toObject();
      eObj.registrationCount = countMap[event._id.toString()] || 0;
      return eObj;
    });

    res.status(200).json({
      success: true,
      count: events.length,
      events: eventsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single event by ID
// @route GET /api/events/:id
// @access Private (Organizer/Admin)
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!checkEventOwnership(event, req.user._id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view or manage this event.',
      });
    }

    const registrationCount = await Registration.countDocuments({ event: event._id });

    const eventObj = event.toObject();
    eventObj.registrationCount = registrationCount;

    res.status(200).json({
      success: true,
      event: eventObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update event
// @route PUT /api/events/:id
// @access Private (Organizer/Admin)
const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!checkEventOwnership(event, req.user._id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to modify this event.',
      });
    }

    // Update fields
    const allowedFields = [
      'title',
      'tagline',
      'description',
      'category',
      'date',
      'endDate',
      'time',
      'venue',
      'organizer',
      'contact',
      'template',
      'theme',
      'heroImage',
      'sections',
      'status',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete event
// @route DELETE /api/events/:id
// @access Private (Organizer/Admin)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!checkEventOwnership(event, req.user._id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this event.',
      });
    }

    // Delete associated registrations
    await Registration.deleteMany({ event: event._id });
    await Event.deleteOne({ _id: event._id });

    res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Publish event
// @route POST /api/events/:id/publish
// @access Private (Organizer/Admin)
const publishEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!checkEventOwnership(event, req.user._id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to publish this event.',
      });
    }

    event.status = 'published';
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event published successfully! It is now live to the public.',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Unpublish event
// @route POST /api/events/:id/unpublish
// @access Private (Organizer/Admin)
const unpublishEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!checkEventOwnership(event, req.user._id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to unpublish this event.',
      });
    }

    event.status = 'draft';
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event unpublished. It has been moved to drafts.',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get registrations for an event
// @route GET /api/events/:id/registrations
// @access Private (Organizer/Admin)
const getEventRegistrations = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!checkEventOwnership(event, req.user._id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot access registrations for another organizer\'s event.',
      });
    }

    const registrations = await Registration.find({ event: event._id })
      .populate('participant', 'name email phone college')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      eventTitle: event.title,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  publishEvent,
  unpublishEvent,
  getEventRegistrations,
};
