# DevForge — AI-Powered No-Code Event Website Builder & College Event Discovery Platform

DevForge is a full-stack platform built for colleges, student organizations, and campus event organizers to design, customize, and publish professional event websites in minutes using AI, while allowing students to discover events, register without passwords via OTP, and manage digital event passes in one unified dashboard.

---

## 🚀 Key Features & Role Architecture

### 1. Platform Admin (`/admin/dashboard`)
- **System Governance**: Monitor platform-wide statistics (total organizers, participants, published events, total registrations).
- **Directory Moderation**: Inspect organizers and attendees, with the ability to deactivate or unblock accounts.
- **Event Oversight**: View all hosted events and moderate/delete inappropriate listings.
- **Root Credentials**: Initialized securely on startup (Default: `admin@devforge.io` / `Admin@DevForge2026!`).

### 2. Event Organizer (`/organizer/dashboard`)
- **Organizer Authentication**: Email + Password registration and login.
- **AI-Powered Event Builder**: Provide a 1-sentence prompt (e.g. *"Technical fest for AI and Data Science students with a hackathon, workshops and coding competition"*), and the AI automatically synthesizes event descriptions, schedule timelines, keynote speaker profiles, and FAQs.
- **3 Professional Website Templates**:
  - **Modern**: Futuristic dark neon gradient layout with glowing badges and glassmorphism.
  - **Professional**: Clean executive conference/summit layout with structured agenda tracks and speaker directories.
  - **College Fest**: High-energy, vibrant campus festival layout with stage schedules and performer highlights.
- **Live Preview**: Real-time side-by-side or fullscreen live preview while editing.
- **Publish & Unpublish**: 1-click publishing to dedicated public URLs (e.g. `/events/<public-slug>`).
- **Attendee Roster Management**: Inspect student attendee lists and export registrations directly to CSV.

### 3. Student Participant (`/participant/dashboard`)
- **Passwordless OTP Login**: Enter email or phone, verify with a 6-digit OTP code (with dev mode fallback).
- **Unified Event Discovery**: Search and filter events across categories (Hackathons, Tech Fests, Conferences, Workshops, Cultural, Sports).
- **Instant Digital Event Passes**: Upon registration, receive an official digital pass featuring a unique ID (`DF-XXX-XXXXXX`), attendee details, event schedule, and venue information.
- **Pass Printing & Download**: Print-ready pass design for seamless campus entrance verification.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router DOM, Axios.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), BcryptJS.
- **AI Engine**: Google Gemini API integration with intelligent, context-aware local fallback generator.
- **Security**: JWT authentication, bcrypt password hashing, role-based middleware guards, data isolation between organizers.

---

## 📂 Project Structure

```text
MajorProject/
├── package.json                   # Root package script runner
├── .env.example                   # Root environment template
├── README.md                      # Complete project documentation
├── server/                        # Express Backend
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   ├── test-e2e.js                # End-to-end automated test suite
│   └── src/
│       ├── index.js               # Express application entrypoint
│       ├── config/db.js           # MongoDB connection configuration
│       ├── models/
│       │   ├── User.js            # User model (Admin, Organizer, Participant)
│       │   ├── Event.js           # Event website model with sections & slug
│       │   ├── Registration.js    # Event registrations & unique pass IDs
│       │   └── ParticipantOTP.js  # TTL-indexed temporary OTP records
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── eventController.js
│       │   ├── publicController.js
│       │   ├── adminController.js
│       │   └── aiController.js
│       ├── services/
│       │   └── aiService.js       # Gemini API + Smart fallback generator
│       ├── middleware/
│       │   ├── auth.js            # JWT verification & role authorization
│       │   └── errorHandler.js    # Global error handler
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── eventRoutes.js
│       │   ├── publicRoutes.js
│       │   ├── adminRoutes.js
│       │   └── aiRoutes.js
│       └── utils/
│           └── seed.js            # Initial database seed script
└── client/                        # React + Vite Frontend
    ├── package.json
    ├── vite.config.js             # Vite configuration with API proxy
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                # Application routes & layout
        ├── index.css
        ├── api/axios.js           # Axios interceptors with Bearer token
        ├── context/AuthContext.jsx # Global auth state & role router
        ├── components/
        │   ├── Navbar.jsx         # Dynamic role-based navigation bar
        │   ├── Footer.jsx
        │   ├── ProtectedRoute.jsx # Role-based route guard
        │   ├── EventCard.jsx      # Discovery event card
        │   ├── EventPassCard.jsx  # Printable digital event pass
        │   └── AiGeneratorModal.jsx # Interactive AI prompt generator
        ├── templates/
        │   ├── ModernTemplate.jsx
        │   ├── ProfessionalTemplate.jsx
        │   ├── FestTemplate.jsx
        │   └── TemplateRenderer.jsx
        └── pages/
            ├── LandingPage.jsx
            ├── ExploreEventsPage.jsx
            ├── PublicEventPage.jsx
            ├── LoginChoicePage.jsx
            ├── OrganizerLoginPage.jsx
            ├── OrganizerRegisterPage.jsx
            ├── ParticipantOtpPage.jsx
            ├── AdminLoginPage.jsx
            ├── OrganizerDashboard.jsx
            ├── EventBuilderPage.jsx
            ├── EventRegistrationsPage.jsx
            ├── ParticipantDashboard.jsx
            ├── AdminDashboard.jsx
            └── NotFoundPage.jsx
```

---

## 🏃 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally on port 27017 or a MongoDB Atlas URI

### 2. Configure Environment
In `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/devforge
JWT_SECRET=devforge_super_secure_jwt_secret_key_2026_production_grade
CLIENT_URL=http://localhost:5173

ADMIN_EMAIL=admin@devforge.io
ADMIN_PASSWORD=Admin@DevForge2026!
ADMIN_NAME=Platform Administrator

# Optional: Google Gemini API Key (Smart fallback works seamlessly without key)
GEMINI_API_KEY=
```

### 3. Run Application
From root directory:
```bash
# Terminal 1: Start Backend (Port 5000)
npm run server

# Terminal 2: Start Frontend (Port 5173)
npm run client
```

Or run directly in respective folders:
```bash
# Backend
cd server
npm start

# Frontend
cd client
npm run dev
```

The application will be live at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api/health`

---

## 🧪 Running Automated Tests

Run the complete 25-point automated end-to-end test suite:
```bash
cd server
node test-e2e.js
```
This tests:
1. Health check & database connection
2. Platform Admin login & stats API
3. Organizer registration & JWT token
4. AI content generation
5. Event creation with draft state
6. Template customization (Modern, Professional, Fest)
7. Publishing event & unique public slug generation
8. Public event discovery & template rendering
9. Participant passwordless OTP flow & dev fallback
10. Event registration & Digital Event Pass issuance
11. Duplicate registration prevention
12. Participant passes persistence
13. Organizer attendee roster & stats
14. Security guards (401 Unauthorized, 403 Forbidden for cross-roles & cross-organizers)
15. Unpublish & cascade deletion.

---

## 🌐 Deployment Ready Guide

### Backend (Render / Railway)
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node src/index.js`
- Set Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL`.

### Frontend (Vercel / Netlify)
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Set Environment Variable: `VITE_API_URL` to your backend Render URL.
