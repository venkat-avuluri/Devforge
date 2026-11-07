const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devforge';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to database');

    // 1. Seed or update Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@devforge.io').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@DevForge2026!';
    const adminName = process.env.ADMIN_NAME || 'Platform Administrator';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        college: 'DevForge HQ',
        phone: '+91 98765 00000',
      });
      console.log(`[Seed] Admin created: ${adminEmail}`);
    } else {
      console.log(`[Seed] Admin already exists: ${adminEmail}`);
    }

    // 2. Seed Organizer
    const orgEmail = 'organizer@mit.edu';
    let organizer = await User.findOne({ email: orgEmail });
    if (!organizer) {
      organizer = await User.create({
        name: 'MIT Tech Club',
        email: orgEmail,
        password: 'Password123!',
        role: 'organizer',
        college: 'Massachusetts Institute of Technology',
        phone: '+91 98765 43210',
      });
      console.log(`[Seed] Organizer created: ${orgEmail}`);
    }

    // 3. Seed Participant
    const partEmail = 'alex.student@university.edu';
    let participant = await User.findOne({ email: partEmail });
    if (!participant) {
      participant = await User.create({
        name: 'Alex Rivera',
        email: partEmail,
        phone: '+91 91234 56789',
        college: 'Stanford University',
        role: 'participant',
      });
      console.log(`[Seed] Participant created: ${partEmail}`);
    }

    // 4. Seed Events if none exist
    const countEvents = await Event.countDocuments();
    if (countEvents === 0) {
      console.log('[Seed] Seeding sample published events for discovery...');

      const sampleEvents = [
        {
          owner: organizer._id,
          title: 'HackNova 2026: 36-Hour National Hackathon',
          tagline: 'Code, Innovate, and Deploy the Future in 36 Hours of Pure Engineering',
          description: 'HackNova is one of the premier college hackathons bringing together over 500+ student developers, designers, and innovators. Compete for prizes worth $10,000, connect with top tech recruiters, and turn your boldest ideas into production-ready software.',
          category: 'Hackathon',
          date: '2026-11-15',
          endDate: '2026-11-17',
          time: '08:00 AM - 08:00 PM',
          venue: 'Campus Innovation Center, Grand Arena',
          organizer: 'MIT Computer Society & Developer Club',
          contact: {
            name: 'Sarah Chen',
            email: 'hacknova@mit.edu',
            phone: '+91 98765 11111',
          },
          template: 'modern',
          theme: { primaryColor: '#6366f1', accentColor: '#06b6d4', darkMode: true },
          heroImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&auto=format&fit=crop&q=80',
          sections: {
            about: {
              title: 'About HackNova 2026',
              content: 'Join 500+ passionate collegiate builders for 36 hours of non-stop creativity. Build software, hardware, or AI systems with mentor guidance, cloud credits, and exciting sponsor tracks.',
              highlights: [
                'Over $10,000 in Cash Prizes and Cloud Credits',
                'Mentorship from Senior FAANG & Startup Engineers',
                'Fast-track Summer Internship Interviews',
                'Free Meals, Exclusive Swag & 24/7 Gaming Lounge',
              ],
            },
            schedule: [
              {
                time: 'Day 1 - 08:00 AM',
                title: 'Check-in & Welcome Breakfast',
                description: 'Collect your attendee pass, grab hacker swag kits, and network.',
                speaker: 'Welcome Crew',
                location: 'Grand Lobby',
              },
              {
                time: 'Day 1 - 10:00 AM',
                title: 'Opening Keynote & Challenge Reveal',
                description: 'Problem statements unlocked across AI, Web3, FinTech, and Social Good.',
                speaker: 'Elena Vance, VP of AI',
                location: 'Main Auditorium',
              },
              {
                time: 'Day 1 - 11:30 AM',
                title: 'Hacking Begins & Team Formations',
                description: 'Teams lock in their ideas and start building.',
                speaker: 'Tech Mentors',
                location: 'Hacker Hall A & B',
              },
              {
                time: 'Day 2 - 04:00 PM',
                title: 'Project Submission & Final Demos',
                description: 'Live judging round and product demonstrations.',
                speaker: 'Jury Panel',
                location: 'Expo Stage',
              },
            ],
            speakers: [
              {
                name: 'Elena Vance',
                role: 'VP of AI Research',
                organization: 'NeuralTech Global',
                photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
                bio: 'Pioneering multimodal AI architectures and championing student developer programs worldwide.',
              },
              {
                name: 'David O\'Connor',
                role: 'Principal Cloud Architect',
                organization: 'Apex Systems',
                photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
                bio: 'Author and tech strategist specializing in scalable microservices and distributed real-time systems.',
              },
            ],
            sponsors: [
              {
                name: 'Google Cloud',
                tier: 'Title Partner',
                logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
                website: 'https://cloud.google.com',
              },
              {
                name: 'GitHub',
                tier: 'Platinum',
                logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
                website: 'https://github.com',
              },
            ],
            faqs: [
              {
                question: 'Who can register for HackNova?',
                answer: 'Any enrolled undergraduate or graduate student is eligible to participate.',
              },
              {
                question: 'What is the team size limit?',
                answer: 'You can participate solo or in teams of up to 4 members.',
              },
              {
                question: 'Is accommodation provided?',
                answer: 'Yes! Designated resting zones, meals, and 24/7 security are provided for the entire duration.',
              },
            ],
          },
          status: 'published',
          publicSlug: 'hacknova-2026',
        },
        {
          owner: organizer._id,
          title: 'ApexCon 2026: National Tech & AI Summit',
          tagline: 'The Definitive Academic & Industry Summit on Emerging Intelligence',
          description: 'ApexCon convenes prominent researchers, industry executives, and ambitious student innovators to explore the cutting edge of artificial intelligence, cybersecurity, and future computing architectures.',
          category: 'Conference',
          date: '2026-12-05',
          endDate: '2026-12-06',
          time: '09:00 AM - 05:30 PM',
          venue: 'Convention Hall & Research Pavilion',
          organizer: 'Institute Research Foundation',
          contact: {
            name: 'Dr. Robert Lang',
            email: 'apexcon@mit.edu',
            phone: '+91 98765 22222',
          },
          template: 'professional',
          theme: { primaryColor: '#0f172a', accentColor: '#2563eb', darkMode: false },
          heroImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80',
          sections: {
            about: {
              title: 'Executive Summit Overview',
              content: 'An intensive two-day summit exploring enterprise generative AI, ethical computing, and next-generation autonomous systems. Features peer-reviewed paper presentations and executive fireside chats.',
              highlights: [
                '12+ Keynotes from Academic & Industry Leaders',
                'Peer-Reviewed Student Research Paper Sessions',
                'Exclusive VIP Networking Dinner and Roundtables',
                'Published Conference Proceedings & Citations',
              ],
            },
            schedule: [
              {
                time: '09:00 AM - 10:15 AM',
                title: 'Keynote: The Frontier of Autonomous Agents',
                description: 'Deep dive into collaborative multi-agent reasoning systems.',
                speaker: 'Dr. Marcus Sterling',
                location: 'Auditorium Alpha',
              },
              {
                time: '10:45 AM - 01:00 PM',
                title: 'Technical Track: Scalable Foundation Models',
                description: 'Research presentations on high-throughput inference and quantization.',
                speaker: 'Research Panel',
                location: 'Hall B',
              },
              {
                time: '02:00 PM - 04:30 PM',
                title: 'Industry Fireside: Enterprise AI Deployment',
                description: 'Practical case studies in deploying AI within regulated environments.',
                speaker: 'CTO Roundtable',
                location: 'Auditorium Alpha',
              },
            ],
            speakers: [
              {
                name: 'Dr. Marcus Sterling',
                role: 'Director of Advanced Research',
                organization: 'Cognitive Dynamics',
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
                bio: 'Pioneered neuro-symbolic AI models with over 80 high-impact research citations.',
              },
              {
                name: 'Samantha Wright',
                role: 'Chief Security Architect',
                organization: 'QuantumShield',
                photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
                bio: 'Advises national organizations on cryptographic resilience and critical infrastructure protection.',
              },
            ],
            sponsors: [
              {
                name: 'IBM Quantum',
                tier: 'Strategic Partner',
                logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80',
                website: 'https://ibm.com',
              },
            ],
            faqs: [
              {
                question: 'Can undergraduate students submit research posters?',
                answer: 'Yes! We host a dedicated undergraduate research poster gallery with awards.',
              },
              {
                question: 'Is formal business attire required?',
                answer: 'Business casual attire is recommended for all attendees.',
              },
            ],
          },
          status: 'published',
          publicSlug: 'apexcon-2026',
        },
        {
          owner: organizer._id,
          title: 'Tarang 2026: Annual Inter-College Cultural Fest',
          tagline: 'Colors, Rhythms, Beats & Endless Celebrations on Campus',
          description: 'Experience three electrifying days of campus culture, musical sensations, live theatrical battles, street plays, fashion galas, and an unforgettable celebrity concert night at Tarang 2026!',
          category: 'Cultural',
          date: '2026-10-28',
          endDate: '2026-10-30',
          time: '10:00 AM - 10:00 PM',
          venue: 'Open Air Amphitheatre & Sports Complex',
          organizer: 'Student Cultural Committee',
          contact: {
            name: 'Rohan Verma',
            email: 'tarangfest@mit.edu',
            phone: '+91 98765 33333',
          },
          template: 'fest',
          theme: { primaryColor: '#ec4899', accentColor: '#f59e0b', darkMode: false },
          heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
          sections: {
            about: {
              title: 'Celebrate The Spirit of Youth',
              content: 'Tarang is the largest youth festival in the region, bringing together over 3,000 students across 40 colleges. From intense dance battles to rock band showdowns, Tarang is where campus memories are made.',
              highlights: [
                '30+ Inter-College Cultural Competitions',
                'Grand Celebrity Musical Pro-Nite',
                'Battle of the Bands & Street Play Showdowns',
                'Over ₹3,00,000 in Prizes & Trophies',
              ],
            },
            schedule: [
              {
                time: 'Day 1 - 10:00 AM',
                title: 'Grand Fest Carnival & Flash Mob',
                description: 'The mega kick-off of Tarang with campus carnival parades and flash mobs.',
                speaker: 'Student Council',
                location: 'Central Plaza',
              },
              {
                time: 'Day 1 - 04:00 PM',
                title: 'Step Up: Inter-College Western Dance Battle',
                description: 'Energetic crew dance competition with celebrity choreographers judging.',
                speaker: 'Dance Society',
                location: 'Open Air Amphitheatre',
              },
              {
                time: 'Day 2 - 06:00 PM',
                title: 'Acoustics & Battle of the Bands',
                description: 'College rock bands battle it out for the coveted Golden Guitar.',
                speaker: 'Music Club',
                location: 'Main Stage',
              },
              {
                time: 'Day 3 - 07:00 PM',
                title: 'Star Celebrity Concert Night',
                description: 'Live musical concert featuring top headline artists to wrap up the festival.',
                speaker: 'Guest Artist',
                location: 'Grand Stadium',
              },
            ],
            speakers: [
              {
                name: 'Kavya Sen',
                role: 'Renowned Indie Vocalist',
                organization: 'Headline Performer',
                photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                bio: 'Chart-topping singer and composer celebrated for fusion indie pop.',
              },
            ],
            sponsors: [
              {
                name: 'Red Bull',
                tier: 'Energy Partner',
                logo: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&auto=format&fit=crop&q=80',
                website: 'https://redbull.com',
              },
            ],
            faqs: [
              {
                question: 'Can students from other colleges attend?',
                answer: 'Yes! Students from any college can register on DevForge with their student ID.',
              },
              {
                question: 'Is entry pass required for pro-nite?',
                answer: 'Yes, your digital DevForge event pass serves as entry badge at security gates.',
              },
            ],
          },
          status: 'published',
          publicSlug: 'tarang-2026',
        },
      ];

      for (const ev of sampleEvents) {
        const created = await Event.create(ev);
        console.log(`[Seed] Created sample event: "${created.title}" (slug: ${created.publicSlug})`);
      }

      // Create a sample registration for Alex on HackNova
      const hacknova = await Event.findOne({ publicSlug: 'hacknova-2026' });
      if (hacknova && participant) {
        await Registration.create({
          event: hacknova._id,
          participant: participant._id,
          name: participant.name,
          email: participant.email,
          phone: participant.phone,
          college: participant.college,
          registrationId: 'DF-HAC-782194',
          registeredAt: new Date(),
        });
        console.log('[Seed] Sample registration created for participant Alex on HackNova');
      }
    }

    console.log('[Seed] Seeding completed successfully!');
  } catch (err) {
    console.error(`[Seed] Error during seeding: ${err.message}`);
  }
};

module.exports = seedData;

if (require.main === module) {
  seedData().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
