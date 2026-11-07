/**
 * DevForge End-to-End Automated Test Suite
 * Validates all backend APIs, authentication roles, event creation,
 * AI content generation, public discovery, OTP flow, digital pass issuance,
 * and security authorization guards.
 */

const BASE_URL = 'http://localhost:5000';

const runTests = async () => {
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  };

  console.log('\n======================================================');
  console.log(' Starting DevForge End-to-End Test Suite');
  console.log('======================================================\n');

  try {
    // 1. Health Check
    console.log('1. Testing System Health...');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.status === 'healthy', 'API Health check returns 200 OK');

    // 2. Admin Authentication
    console.log('\n2. Testing Platform Admin Authentication...');
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@devforge.io', password: 'Admin@DevForge2026!' }),
    });
    const adminLoginJson = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginJson.token && adminLoginJson.user.role === 'admin', 'Admin login successful with JWT and admin role');
    const adminToken = adminLoginJson.token;

    // Admin Dashboard Stats
    const adminStatsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminStatsJson = await adminStatsRes.json();
    assert(adminStatsRes.status === 200 && adminStatsJson.stats.totalEvents >= 1, 'Admin can view platform KPI statistics');

    // 3. Organizer Registration & Login
    console.log('\n3. Testing Organizer Registration & Lifecycle...');
    const orgEmail = `testorg_${Date.now()}@campus.edu`;
    const orgRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Robotics & AI Club',
        email: orgEmail,
        password: 'Password123!',
        college: 'National Institute of Tech',
        phone: '+91 99999 88888',
      }),
    });
    const orgRegJson = await orgRegRes.json();
    assert(orgRegRes.status === 201 && orgRegJson.token && orgRegJson.user.role === 'organizer', 'Organizer account registered and JWT generated');
    const orgToken = orgRegJson.token;

    // 4. AI Content Generation
    console.log('\n4. Testing AI Content Generation Engine...');
    const aiRes = await fetch(`${BASE_URL}/api/ai/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${orgToken}`,
      },
      body: JSON.stringify({
        prompt: 'Technical fest for AI and Data Science students with a hackathon, workshops and coding competition.',
        category: 'Technical Fest',
        college: 'National Institute of Tech',
      }),
    });
    const aiJson = await aiRes.json();
    assert(
      aiRes.status === 200 &&
      aiJson.success &&
      aiJson.data.title &&
      aiJson.data.schedule?.length > 0 &&
      aiJson.data.speakers?.length > 0,
      'AI generated structured title, schedule timeline, and keynote speakers'
    );
    const aiData = aiJson.data;

    // 5. Organizer Event Creation & Template Selection
    console.log('\n5. Testing Event Website Builder (Create & Templates)...');
    const createEventRes = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${orgToken}`,
      },
      body: JSON.stringify({
        title: aiData.title,
        tagline: aiData.tagline,
        description: aiData.description,
        category: aiData.category,
        date: '2026-11-20',
        venue: 'Grand Innovation Complex',
        organizer: 'Robotics & AI Club',
        template: 'modern',
        sections: {
          about: aiData.about,
          schedule: aiData.schedule,
          speakers: aiData.speakers,
          faqs: aiData.faqs,
        },
      }),
    });
    const createEventJson = await createEventRes.json();
    assert(createEventRes.status === 201 && createEventJson.event._id, 'Event created as draft with generated content');
    const eventId = createEventJson.event._id;

    // Switch Template and Update
    const updateEventRes = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${orgToken}`,
      },
      body: JSON.stringify({ template: 'fest' }),
    });
    const updateEventJson = await updateEventRes.json();
    assert(updateEventRes.status === 200 && updateEventJson.event.template === 'fest', 'Organizer successfully customized website template to fest');

    // Publish Event
    const publishRes = await fetch(`${BASE_URL}/api/events/${eventId}/publish`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${orgToken}` },
    });
    const publishJson = await publishRes.json();
    assert(publishRes.status === 200 && publishJson.event.status === 'published', 'Event published to public domain');
    const publicSlug = publishJson.event.publicSlug;
    assert(!!publicSlug, `Generated unique public slug: /events/${publicSlug}`);

    // 6. Public Event Discovery & Viewing
    console.log('\n6. Testing Public Event Discovery & Template Page...');
    const publicListRes = await fetch(`${BASE_URL}/api/public/events`);
    const publicListJson = await publicListRes.json();
    const foundInList = publicListJson.events.some((e) => e.publicSlug === publicSlug);
    assert(publicListRes.status === 200 && foundInList, 'Published event visible in public discovery directory');

    // Public Event Page by Slug
    const publicPageRes = await fetch(`${BASE_URL}/api/public/events/${publicSlug}`);
    const publicPageJson = await publicPageRes.json();
    assert(
      publicPageRes.status === 200 &&
      publicPageJson.event.title === aiData.title &&
      publicPageJson.event.template === 'fest',
      'Public event page loads correctly with sections & chosen template'
    );

    // 7. Participant OTP Authentication
    console.log('\n7. Testing Participant OTP Authentication Flow...');
    const participantIdentifier = `student_${Date.now()}@university.edu`;
    const otpReqRes = await fetch(`${BASE_URL}/api/auth/participant/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: participantIdentifier }),
    });
    const otpReqJson = await otpReqRes.json();
    assert(otpReqRes.status === 200 && otpReqJson.devOtp, 'OTP successfully generated and delivered');
    const sentOtp = otpReqJson.devOtp;

    // Verify OTP
    const otpVerifyRes = await fetch(`${BASE_URL}/api/auth/participant/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: participantIdentifier,
        otp: sentOtp,
        name: 'Jordan Smith',
        college: 'Engineering University',
      }),
    });
    const otpVerifyJson = await otpVerifyRes.json();
    assert(
      otpVerifyRes.status === 200 &&
      otpVerifyJson.token &&
      otpVerifyJson.user.role === 'participant',
      'Participant OTP verified and participant JWT session established'
    );
    const participantToken = otpVerifyJson.token;

    // 8. Event Registration & Digital Event Pass
    console.log('\n8. Testing Event Registration & Digital Pass...');
    const registerRes = await fetch(`${BASE_URL}/api/public/events/${publicSlug}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${participantToken}`,
      },
      body: JSON.stringify({
        name: 'Jordan Smith',
        email: participantIdentifier,
        phone: '+91 91234 56789',
        college: 'Engineering University',
      }),
    });
    const registerJson = await registerRes.json();
    assert(
      registerRes.status === 201 &&
      registerJson.registration &&
      registerJson.pass?.registrationId?.startsWith('DF-'),
      `Digital Event Pass generated with unique ID: ${registerJson.pass?.registrationId}`
    );

    // Test Duplicate Registration Prevention
    const duplicateRegRes = await fetch(`${BASE_URL}/api/public/events/${publicSlug}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${participantToken}`,
      },
      body: JSON.stringify({
        name: 'Jordan Smith',
        email: participantIdentifier,
      }),
    });
    const duplicateRegJson = await duplicateRegRes.json();
    assert(
      duplicateRegRes.status === 400 && duplicateRegJson.alreadyRegistered === true,
      'Duplicate registration correctly rejected by system'
    );

    // 9. Participant Dashboard Passes
    console.log('\n9. Testing Participant Passes Persistence...');
    const myPassesRes = await fetch(`${BASE_URL}/api/public/participant/registrations`, {
      headers: { Authorization: `Bearer ${participantToken}` },
    });
    const myPassesJson = await myPassesRes.json();
    assert(
      myPassesRes.status === 200 && myPassesJson.registrations.length === 1,
      'Participant dashboard displays registered pass accurately'
    );

    // 10. Organizer Attendee Roster
    console.log('\n10. Testing Organizer Registrations Roster...');
    const rosterRes = await fetch(`${BASE_URL}/api/events/${eventId}/registrations`, {
      headers: { Authorization: `Bearer ${orgToken}` },
    });
    const rosterJson = await rosterRes.json();
    assert(
      rosterRes.status === 200 &&
      rosterJson.count === 1 &&
      rosterJson.registrations[0].email === participantIdentifier,
      'Organizer can view attendee roster with participant details'
    );

    // 11. Security & Role Authorization Guardrails
    console.log('\n11. Testing Security & Role-Based Authorization...');
    // A: Participant trying to access Organizer routes
    const partAccessOrg = await fetch(`${BASE_URL}/api/events`, {
      headers: { Authorization: `Bearer ${participantToken}` },
    });
    assert(partAccessOrg.status === 403, 'Participant denied access to Organizer /api/events (403 Forbidden)');

    // B: Participant trying to access Admin routes
    const partAccessAdmin = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${participantToken}` },
    });
    assert(partAccessAdmin.status === 403, 'Participant denied access to Admin /api/admin/stats (403 Forbidden)');

    // C: Organizer trying to access Admin routes
    const orgAccessAdmin = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${orgToken}` },
    });
    assert(orgAccessAdmin.status === 403, 'Organizer denied access to Admin /api/admin/stats (403 Forbidden)');

    // D: Unauthenticated user trying to access protected routes
    const anonAccessOrg = await fetch(`${BASE_URL}/api/events`);
    assert(anonAccessOrg.status === 401, 'Anonymous visitor denied access to protected endpoints (401 Unauthorized)');

    // E: Cross-organizer isolation (Organizer 2 trying to edit Organizer 1 event)
    const org2RegRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another Club',
        email: `org2_${Date.now()}@campus.edu`,
        password: 'Password123!',
        college: 'Another College',
      }),
    });
    const org2Token = (await org2RegRes.json()).token;
    const org2EditOrg1 = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${org2Token}`,
      },
      body: JSON.stringify({ title: 'Hacked Title' }),
    });
    assert(org2EditOrg1.status === 403, 'Organizer cannot modify another organizer\'s event (403 Forbidden)');

    // 12. Unpublish & Delete Event
    console.log('\n12. Testing Unpublish & Event Deletion...');
    const unpublishRes = await fetch(`${BASE_URL}/api/events/${eventId}/unpublish`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${orgToken}` },
    });
    assert(unpublishRes.status === 200, 'Organizer unpublished event');

    // Check that unpublished event is no longer accessible publicly
    const publicUnpublishedCheck = await fetch(`${BASE_URL}/api/public/events/${publicSlug}`);
    assert(publicUnpublishedCheck.status === 404, 'Unpublished event is not accessible on public route (404)');

    // Delete Event
    const deleteRes = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${orgToken}` },
    });
    assert(deleteRes.status === 200, 'Organizer deleted event and associated registrations');

    console.log('\n======================================================');
    console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log('======================================================\n');

    process.exit(failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('Test Suite Fatal Error:', error);
    process.exit(1);
  }
};

runTests();
