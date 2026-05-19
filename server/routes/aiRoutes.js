const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

/**
 * @route   POST /api/ai/ask
 * @desc    Universal AI Assistant endpoint (RAG-enabled)
 */
router.post('/ask', async (req, res) => {
  const { query, role } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const response = await aiService.generateIntelligentResponse(query, role || 'coach');
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/ai/fraud-check
 * @desc    Quick AI-generated fraud analysis
 */
router.get('/fraud-check', async (req, res) => {
  try {
    const response = await aiService.generateIntelligentResponse(
      "Analyze the recent geofence logs for any suspicious patterns or impossible travel timings.",
      'admin'
    );
    res.json({ analysis: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
