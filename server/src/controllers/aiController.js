const { generateEventContent } = require('../services/aiService');

// @desc Generate AI-assisted event content
// @route POST /api/ai/generate-content
// @access Private (Organizer/Admin)
const generateContent = async (req, res, next) => {
  try {
    const { prompt, title, category, college } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a description or prompt for the AI to generate content.',
      });
    }

    const generated = await generateEventContent(prompt.trim(), {
      title,
      category,
      college: college || (req.user ? req.user.college : ''),
    });

    res.status(200).json({
      success: true,
      message: 'AI content generated successfully',
      data: generated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateContent,
};
