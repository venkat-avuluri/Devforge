const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

// Generate unique Registration ID
const generateRegistrationId = (category = 'EVT') => {
  const prefix = (category.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '') || 'EVT');
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `DF-${prefix}-${randomNum}`;
};

// @desc Get all published events with search and filter
// @route GET /api/public/events
// @access Public
const getPublicEvents = async (req, res, next) => {
  try {
    const { search, category, filter } = req.query;

    let query = { status: 'published' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { organizer: regex },
        { venue: regex },
      ];
    }

    const events = await Event.find(query)
      .select('title tagline category date endDate time venue organizer heroImage template publicSlug createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single published event by slug
// @route GET /api/public/events/:slug
// @access Public
const getPublicEventBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Check by publicSlug or fallback to ObjectId if slug is a valid mongo id
    let event = await Event.findOne({ publicSlug: slug });
    if (!event && slug.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(slug);
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or has been removed.',
      });
    }

    // Only published events are visible to public visitors
    if (event.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'This event is currently in draft mode and not published.',
      });
    }

    // Include registration count
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

// @desc Register participant for an event
// @route POST /api/public/events/:slug/register
// @access Public / Authenticated Participant
const registerForEvent = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name, email, phone, college } = req.body;

    let event = await Event.findOne({ publicSlug: slug });
    if (!event && slug.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(slug);
    }

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for an unpublished event.',
      });
    }

    let participantId;
    let participantName = name;
    let participantEmail = email ? email.toLowerCase().trim() : '';
    let participantPhone = phone || '';
    let participantCollege = college || '';

    // If user is authenticated via Bearer token
    if (req.user) {
      participantId = req.user._id;
      participantName = req.user.name;
      participantEmail = req.user.email.toLowerCase().trim();
      participantPhone = req.user.phone || participantPhone;
      participantCollege = req.user.college || participantCollege;
    } else {
      if (!participantEmail || !participantName) {
        return res.status(400).json({
          success: false,
          message: 'Full name and email are required to register for this event.',
        });
      }

      // Find or create participant user
      let existingUser = await User.findOne({ email: participantEmail });
      if (!existingUser) {
        existingUser = await User.create({
          name: participantName,
          email: participantEmail,
          phone: participantPhone,
          college: participantCollege,
          role: 'participant',
        });
      }
      participantId = existingUser._id;
    }

    // Check duplicate registration
    const existingRegistration = await Registration.findOne({
      event: event._id,
      $or: [{ participant: participantId }, { email: participantEmail }],
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event. Your event pass is available in your dashboard.',
        registrationId: existingRegistration.registrationId,
        alreadyRegistered: true,
      });
    }

    // Generate unique Registration ID
    let registrationId = generateRegistrationId(event.category);
    while (await Registration.exists({ registrationId })) {
      registrationId = generateRegistrationId(event.category);
    }

    const registration = await Registration.create({
      event: event._id,
      participant: participantId,
      name: participantName,
      email: participantEmail,
      phone: participantPhone,
      college: participantCollege,
      registrationId,
      registeredAt: new Date(),
    });

    // Populate event for digital pass display
    const passData = {
      registrationId: registration.registrationId,
      eventTitle: event.title,
      eventCategory: event.category,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      organizer: event.organizer,
      participantName,
      participantEmail,
      participantPhone,
      participantCollege,
      registeredAt: registration.registeredAt,
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful! Digital Event Pass generated.',
      registration,
      pass: passData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get registrations for currently logged in participant
// @route GET /api/participant/registrations
// @access Private (Participant)
const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ participant: req.user._id })
      .populate('event', 'title category date time venue organizer heroImage publicSlug status')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Check if current user is registered for event
// @route GET /api/public/events/:slug/check-registration
// @access Private (Participant)
const checkMyRegistration = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let event = await Event.findOne({ publicSlug: slug });
    if (!event && slug.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(slug);
    }

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const registration = await Registration.findOne({
      event: event._id,
      participant: req.user._id,
    });

    res.status(200).json({
      success: true,
      isRegistered: !!registration,
      registration: registration || null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicEvents,
  getPublicEventBySlug,
  registerForEvent,
  getMyRegistrations,
  checkMyRegistration,
};
