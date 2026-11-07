/**
 * AI Service for DevForge
 * Generates event descriptions, about sections, schedule, speaker suggestions,
 * and marketing content. Supports Google Gemini API with seamless intelligent fallback.
 */

const generateWithGemini = async (prompt, context = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const systemPrompt = `You are an expert event organizer and copywriter for college tech fests, hackathons, and campus conferences.
Given the event prompt and details, return a valid JSON object ONLY with the following exact structure:
{
  "title": "Suggested Event Title",
  "tagline": "Catchy 1-sentence punchy slogan",
  "description": "2-3 paragraphs compelling description for attendees",
  "about": {
    "title": "About The Event",
    "content": "Detailed overview of the event theme, objectives, and experience",
    "highlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4"]
  },
  "schedule": [
    { "time": "09:00 AM - 10:00 AM", "title": "Inauguration & Keynote", "description": "Welcome address and keynote", "speaker": "Chief Guest", "location": "Main Auditorium" },
    { "time": "10:30 AM - 01:00 PM", "title": "Round 1 / Hands-on Sessions", "description": "Interactive tracks and challenges", "speaker": "Track Leads", "location": "Lab 101" },
    { "time": "02:00 PM - 04:30 PM", "title": "Finale & Project Demos", "description": "Showcase of projects and evaluation", "speaker": "Judges Panel", "location": "Auditorium" }
  ],
  "speakers": [
    { "name": "Dr. Sarah Mitchell", "role": "Principal AI Researcher", "organization": "Tech Innovations Inc.", "bio": "Leading expert in modern machine learning systems." },
    { "name": "Arjun Sharma", "role": "Senior Engineering Manager", "organization": "CloudScale Labs", "bio": "Passionate mentor with 12+ years of software architecture experience." }
  ],
  "faqs": [
    { "question": "Who can participate in this event?", "answer": "Students from all recognized colleges and universities are welcome to register." },
    { "question": "Is there any registration fee?", "answer": "Participation is free for shortlisted college students." },
    { "question": "Will certificates be provided?", "answer": "Yes, all verified attendees will receive digital participation certificates." }
  ],
  "promotionalText": "Join us for an unforgettable experience! Register now on DevForge."
}`;

    const userMessage = `Event Category: ${context.category || 'Technical Fest'}
College/Org: ${context.college || 'Engineering College'}
Organizer Provided Details: ${prompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${userMessage}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn(`[Gemini API] Response error status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    return JSON.parse(text);
  } catch (err) {
    console.warn(`[Gemini API] Failed to generate, falling back to local engine: ${err.message}`);
    return null;
  }
};

/**
 * Intelligent Fallback Generator
 * Analyzes keywords and creates tailored, rich, professional event content.
 */
const generateFallback = (prompt = '', context = {}) => {
  const pLower = prompt.toLowerCase();
  const category = context.category || (
    pLower.includes('hack') ? 'Hackathon' :
    pLower.includes('cultural') || pLower.includes('dance') || pLower.includes('music') ? 'Cultural' :
    pLower.includes('workshop') || pLower.includes('hands-on') ? 'Workshop' :
    pLower.includes('sports') ? 'Sports' :
    pLower.includes('conference') ? 'Conference' :
    'Technical Fest'
  );

  const college = context.college || 'DevForge Partner Institution';
  const isAI = pLower.includes('ai') || pLower.includes('artificial intelligence') || pLower.includes('data');
  const isHackathon = pLower.includes('hack') || category === 'Hackathon';
  const isCultural = category === 'Cultural' || pLower.includes('music') || pLower.includes('fest');

  let title = context.title;
  if (!title) {
    if (isHackathon) title = isAI ? 'NeuroHack 2026: AI Innovation Sprint' : 'CodeForge 2026: 24-Hour Hackathon';
    else if (isCultural) title = 'Vibrance 2026: Annual Inter-College Cultural Fest';
    else if (isAI) title = 'DataVision 2026: National AI & Tech Summit';
    else title = `${category} 2026: Ignite Your Potential`;
  }

  let tagline = isHackathon
    ? 'Code, Innovate, and Deploy the Future in 24 Hours of Pure Engineering'
    : isCultural
    ? 'Celebrate Diversity, Music, Art, and Campus Spirit'
    : isAI
    ? 'Empowering the Next Generation of AI Builders and Data Scientists'
    : 'Where Innovation Meets Ambition — Join Hundreds of Aspiring Leaders';

  let description = `Get ready for ${title}, the flagship ${category.toLowerCase()} hosted by ${college}. This premier gathering convenes students, innovators, and industry experts for a day of high-energy collaboration, hands-on learning, and competition.\n\nWhether you are a seasoned coder, a creative visionary, or passionate learner, this event offers an extraordinary stage to showcase your talents, network with top mentors, and win exciting prizes.`;

  let highlights = isHackathon
    ? [
        '24-Hour Non-stop Collaborative Hackathon with Industry Mentorship',
        'Direct Access to Leading Tech Mentors & Senior Engineers',
        'Exciting Cash Prizes, Goodies & Sponsored Cloud Credits',
        'Fast-track Internship and Job Interview Opportunities',
      ]
    : isCultural
    ? [
        'Grand Stage Performances & Battle of the Bands',
        'Inter-College Dance, Drama, and Fine Arts Competitions',
        'Celebrity Guest Night & Musical Live Concert',
        'Trophy and Cash Awards for Top Performing Teams',
      ]
    : [
        'Hands-on Interactive Workshops Led by Domain Specialists',
        'Keynote Addresses by Recognized Industry Pioneers',
        'Competitive Problem-Solving Tracks with Real-time Leaderboards',
        'Official Certificates of Excellence and Participation',
      ];

  let schedule = isHackathon
    ? [
        {
          time: '08:30 AM - 09:30 AM',
          title: 'Registration & Breakfast',
          description: 'Badge collection, welcome kit distribution, and team check-in.',
          speaker: 'Organizing Committee',
          location: 'Reception Lobby',
        },
        {
          time: '09:30 AM - 10:30 AM',
          title: 'Opening Ceremony & Problem Statement Reveal',
          description: 'Keynote address by chief guest and official release of hackathon themes.',
          speaker: 'Dean & Industry Lead',
          location: 'Main Auditorium',
        },
        {
          time: '11:00 AM - 01:00 PM',
          title: 'Hacking Begins: Ideation & Architecture',
          description: 'Teams set up workspace and conduct preliminary design reviews.',
          speaker: 'Technical Mentors',
          location: 'Innovation Hall',
        },
        {
          time: '02:00 PM - 05:00 PM',
          title: 'Mentorship Sprint & Progress Check 1',
          description: 'One-on-one checkpoint with domain mentors to refine project scope.',
          speaker: 'Industry Jury',
          location: 'Hackathon Arena',
        },
        {
          time: '05:30 PM - 07:00 PM',
          title: 'Final Pitches, Demos & Award Ceremony',
          description: 'Top 10 shortlisted teams pitch live on stage followed by prize distribution.',
          speaker: 'Grand Jury Panel',
          location: 'Main Auditorium',
        },
      ]
    : [
        {
          time: '09:00 AM - 10:00 AM',
          title: 'Welcome Address & Keynote',
          description: 'Inaugural lighting of the lamp and introduction of themes.',
          speaker: 'Head of Department',
          location: 'Auditorium A',
        },
        {
          time: '10:30 AM - 12:30 PM',
          title: 'Track Sessions & Technical Workshops',
          description: 'Interactive deep-dives into modern tools, frameworks, and trends.',
          speaker: 'Keynote Presenters',
          location: 'Seminar Halls 1 & 2',
        },
        {
          time: '01:30 PM - 03:30 PM',
          title: 'Main Competition & Project Showcase',
          description: 'Competitive rounds, poster presentations, and live judging.',
          speaker: 'Evaluation Committee',
          location: 'Exhibition Ground',
        },
        {
          time: '04:00 PM - 05:30 PM',
          title: 'Valedictory & Prize Distribution',
          description: 'Honoring winners, distribution of certificates, and closing remarks.',
          speaker: 'Distinguished Guests',
          location: 'Main Auditorium',
        },
      ];

  let speakers = isAI
    ? [
        {
          name: 'Dr. Evelyn Reed',
          role: 'Head of Applied AI Research',
          organization: 'NeuralCore Systems',
          photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
          bio: 'Author of 40+ papers in Deep Learning, specializing in autonomous intelligence and LLM reasoning.',
        },
        {
          name: 'Vikram Malhotra',
          role: 'VP of Engineering',
          organization: 'HyperScale Data',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          bio: 'Veteran architect with extensive experience deploying petabyte-scale distributed data pipelines.',
        },
      ]
    : [
        {
          name: 'Prof. Ramesh Kulkarni',
          role: 'Dean of Student Affairs & Innovation',
          organization: college,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          bio: 'Passionate educator and mentor fostering campus entrepreneurial culture.',
        },
        {
          name: 'Pooja Sundaram',
          role: 'Lead Developer Advocate',
          organization: 'TechForge Global',
          photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
          bio: 'International speaker committed to empowering student developers and open source contributors.',
        },
      ];

  let faqs = [
    {
      question: 'Who is eligible to participate?',
      answer: `Undergraduate and postgraduate students from any recognized educational institution are eligible. Bring your valid college ID.`,
    },
    {
      question: 'Is team participation required or individual allowed?',
      answer: 'Depending on the specific track, both solo participants and teams of 2 to 4 members are warmly welcomed.',
    },
    {
      question: 'What do I need to bring to the venue?',
      answer: 'Bring your student ID card, personal laptop, chargers, and any specialized hardware if participating in technical hardware challenges.',
    },
    {
      question: 'Will food and refreshments be provided?',
      answer: 'Yes, meals, tea, snacks, and hydration stations will be arranged for all registered and verified attendees.',
    },
    {
      question: 'Will I get an event pass and certificate?',
      answer: 'Yes, registering on DevForge grants you an instant Digital Event Pass, and attending unlocks your verified Certificate of Participation.',
    },
  ];

  let promotionalText = `🚀 Ready for ${title}? Discover full details, agenda, and secure your Digital Pass on DevForge today: register before spots fill up!`;

  return {
    title,
    tagline,
    description,
    category,
    about: {
      title: `About ${title}`,
      content: description,
      highlights,
    },
    schedule,
    speakers,
    faqs,
    promotionalText,
    source: 'ai_engine',
  };
};

const generateEventContent = async (prompt, context = {}) => {
  // Try Gemini API first if configured
  const aiResult = await generateWithGemini(prompt, context);
  if (aiResult) {
    return { ...aiResult, source: 'gemini' };
  }

  // Seamless, rich fallback
  return generateFallback(prompt, context);
};

module.exports = {
  generateEventContent,
};
