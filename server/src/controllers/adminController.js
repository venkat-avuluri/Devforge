const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc Get platform statistics for Admin
// @route GET /api/admin/stats
// @access Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalParticipants = await User.countDocuments({ role: 'participant' });
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ status: 'published' });
    const draftEvents = await Event.countDocuments({ status: 'draft' });
    const totalRegistrations = await Registration.countDocuments();

    // Recent events
    const recentEvents = await Event.find()
      .populate('owner', 'name email college')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent registrations
    const recentRegistrations = await Registration.find()
      .populate('event', 'title category')
      .sort({ registeredAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalOrganizers,
        totalParticipants,
        totalEvents,
        publishedEvents,
        draftEvents,
        totalRegistrations,
      },
      recentEvents,
      recentRegistrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all organizers
// @route GET /api/admin/organizers
// @access Private (Admin)
const getOrganizers = async (req, res, next) => {
  try {
    const organizers = await User.find({ role: 'organizer' })
      .select('name email phone college isActive createdAt')
      .sort({ createdAt: -1 });

    // Aggregate event counts per organizer
    const organizerIds = organizers.map((o) => o._id);
    const eventCounts = await Event.aggregate([
      { $match: { owner: { $in: organizerIds } } },
      { $group: { _id: '$owner', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    eventCounts.forEach((ec) => {
      countMap[ec._id.toString()] = ec.count;
    });

    const data = organizers.map((org) => ({
      ...org.toObject(),
      eventCount: countMap[org._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      organizers: data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all participants
// @route GET /api/admin/participants
// @access Private (Admin)
const getParticipants = async (req, res, next) => {
  try {
    const participants = await User.find({ role: 'participant' })
      .select('name email phone college isActive createdAt')
      .sort({ createdAt: -1 });

    const participantIds = participants.map((p) => p._id);
    const regCounts = await Registration.aggregate([
      { $match: { participant: { $in: participantIds } } },
      { $group: { _id: '$participant', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    regCounts.forEach((rc) => {
      countMap[rc._id.toString()] = rc.count;
    });

    const data = participants.map((p) => ({
      ...p.toObject(),
      registrationCount: countMap[p._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      participants: data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all events across platform
// @route GET /api/admin/events
// @access Private (Admin)
const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate('owner', 'name email college')
      .sort({ createdAt: -1 });

    const eventIds = events.map((e) => e._id);
    const regCounts = await Registration.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: '$event', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    regCounts.forEach((rc) => {
      countMap[rc._id.toString()] = rc.count;
    });

    const data = events.map((ev) => ({
      ...ev.toObject(),
      registrationCount: countMap[ev._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      events: data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle active/blocked status of a user
// @route PUT /api/admin/users/:id/toggle-status
// @access Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot deactivate admin user' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been ${user.isActive ? 'activated' : 'blocked'}.`,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete inappropriate event
// @route DELETE /api/admin/events/:id
// @access Private (Admin)
const adminDeleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await Registration.deleteMany({ event: event._id });
    await Event.deleteOne({ _id: event._id });

    res.status(200).json({
      success: true,
      message: 'Event and associated registrations successfully removed by Admin.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle event published/unpublished status
// @route PUT /api/admin/events/:id/toggle-publish
// @access Private (Admin)
const adminTogglePublish = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.status = event.status === 'published' ? 'draft' : 'published';
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event status updated to ${event.status}`,
      event,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getOrganizers,
  getParticipants,
  getAllEvents,
  toggleUserStatus,
  adminDeleteEvent,
  adminTogglePublish,
};
