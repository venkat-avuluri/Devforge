const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ParticipantOTP = require('../models/ParticipantOTP');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'devforge_super_secure_jwt_secret_key_2026_production_grade',
    { expiresIn: '7d' }
  );
};

// @desc Register Organizer
// @route POST /api/auth/register
// @access Public
const registerOrganizer = async (req, res, next) => {
  try {
    const { name, email, password, college, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      college: college || '',
      phone: phone || '',
      role: 'organizer',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Organizer account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login (Admin or Organizer or Password-based)
// @route POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Request OTP for Participant
// @route POST /api/auth/participant/request-otp
// @access Public
const requestParticipantOTP = async (req, res, next) => {
  try {
    const { identifier } = req.body;

    if (!identifier || identifier.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required to receive OTP',
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Generate 6-digit OTP
    // For reliable dev testing, generate random 6 digits
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(8);
    const otpHash = await bcrypt.hash(otp, salt);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete existing OTP for this identifier
    await ParticipantOTP.deleteMany({ identifier: cleanIdentifier });

    // Store new OTP
    await ParticipantOTP.create({
      identifier: cleanIdentifier,
      otpHash,
      expiresAt,
    });

    console.log(`[DevForge Dev Auth] Generated OTP for ${cleanIdentifier}: ${otp}`);

    // In local dev/MVP, provide otp in the payload for immediate testing
    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${cleanIdentifier}`,
      devOtp: otp, // Development convenience fallback
      expiresIn: '10 minutes',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Verify OTP for Participant
// @route POST /api/auth/participant/verify-otp
// @access Public
const verifyParticipantOTP = async (req, res, next) => {
  try {
    const { identifier, otp, name, college, phone } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Identifier and OTP code are required',
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Find OTP record
    const otpRecord = await ParticipantOTP.findOne({ identifier: cleanIdentifier });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not requested. Please request a new code.',
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      await ParticipantOTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new code.',
      });
    }

    const isMatch = await bcrypt.compare(otp.toString().trim(), otpRecord.otpHash);
    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: 'Incorrect OTP code. Please verify and try again.',
      });
    }

    // OTP verified: remove it
    await ParticipantOTP.deleteOne({ _id: otpRecord._id });

    // Check if user exists by email or phone
    const isEmail = cleanIdentifier.includes('@');
    let user;
    if (isEmail) {
      user = await User.findOne({ email: cleanIdentifier });
    } else {
      user = await User.findOne({ phone: cleanIdentifier });
    }

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // If new participant, create account
      const generatedEmail = isEmail ? cleanIdentifier : `${cleanIdentifier.replace(/\D/g, '')}@student.devforge.io`;
      const fallbackName = name && name.trim() ? name.trim() : (isEmail ? cleanIdentifier.split('@')[0] : 'Student Participant');

      user = await User.create({
        name: fallbackName,
        email: generatedEmail,
        phone: isEmail ? (phone || '') : cleanIdentifier,
        college: college || 'College / University',
        role: 'participant',
      });
    } else {
      // If user provided additional profile info on login, update if empty
      if (name && (!user.name || user.name.startsWith('Student'))) user.name = name;
      if (college && !user.college) user.college = college;
      if (phone && !user.phone) user.phone = phone;
      await user.save();
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      isNewUser,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current authenticated user
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Logout user
// @route POST /api/auth/logout
// @access Private
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = {
  registerOrganizer,
  login,
  requestParticipantOTP,
  verifyParticipantOTP,
  getMe,
  logout,
};
