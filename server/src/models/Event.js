const mongoose = require('mongoose');
const slugify = require('slugify');

const eventSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
      maxlength: [250, 'Tagline cannot exceed 250 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please specify event category'],
      enum: [
        'Hackathon',
        'Technical Fest',
        'Workshop',
        'Conference',
        'Cultural',
        'Sports',
        'Competition',
        'Seminar',
        'Other',
      ],
      default: 'Technical Fest',
      index: true,
    },
    date: {
      type: String,
      required: [true, 'Please specify event date'],
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
    time: {
      type: String,
      default: '09:00 AM - 05:00 PM',
    },
    venue: {
      type: String,
      required: [true, 'Please specify event venue'],
      default: 'College Campus / Main Auditorium',
    },
    organizer: {
      type: String,
      required: [true, 'Please specify organizer name'],
      default: '',
    },
    contact: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    template: {
      type: String,
      enum: ['modern', 'professional', 'fest'],
      default: 'modern',
    },
    theme: {
      primaryColor: { type: String, default: '#4f46e5' }, // indigo-600
      accentColor: { type: String, default: '#06b6d4' }, // cyan-500
      darkMode: { type: Boolean, default: false },
    },
    heroImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80',
    },
    sections: {
      about: {
        title: { type: String, default: 'About The Event' },
        content: { type: String, default: '' },
        highlights: { type: [String], default: [] },
      },
      schedule: [
        {
          time: { type: String, default: '' },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          speaker: { type: String, default: '' },
          location: { type: String, default: '' },
        },
      ],
      speakers: [
        {
          name: { type: String, default: '' },
          role: { type: String, default: '' },
          organization: { type: String, default: '' },
          photo: { type: String, default: '' },
          bio: { type: String, default: '' },
        },
      ],
      sponsors: [
        {
          name: { type: String, default: '' },
          tier: { type: String, default: 'Gold' }, // Title, Platinum, Gold, Silver, Partner
          logo: { type: String, default: '' },
          website: { type: String, default: '' },
        },
      ],
      gallery: [
        {
          url: { type: String, default: '' },
          caption: { type: String, default: '' },
        },
      ],
      faqs: [
        {
          question: { type: String, default: '' },
          answer: { type: String, default: '' },
        },
      ],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    publicSlug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique slug before saving
eventSchema.pre('save', async function (next) {
  if (!this.publicSlug || this.isModified('title')) {
    const baseSlug = slugify(this.title, { lower: true, strict: true }) || 'event';
    let slug = baseSlug;
    let count = 1;
    // Check for collisions
    const EventModel = mongoose.model('Event');
    while (await EventModel.exists({ publicSlug: slug, _id: { $ne: this._id } })) {
      count += 1;
      slug = `${baseSlug}-${count}`;
    }
    this.publicSlug = slug;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
