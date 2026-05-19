const express = require('express');
const router = express.Router();
const ragService = require('../services/ragService');
const retrievalService = require('../services/retrievalService');
const fraudService = require('../services/fraudService');
const analyticsService = require('../services/analyticsService');

/**
 * @route   POST /api/ai/ask OR /api/ai/ask-ai
 * @desc    Universal AI Assistant endpoint (RAG-enabled with session memory)
 */
const handleAsk = async (req, res) => {
  const { query, role, sessionId } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const response = await ragService.processQuery(
      query, 
      role || 'coach', 
      sessionId || 'default-session'
    );
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

router.post('/ask', handleAsk);
router.post('/ask-ai', handleAsk);

/**
 * @route   GET /api/ai/attendance-insights
 * @desc    Fetch AI-generated predictive insights on attendance trends
 */
router.get('/attendance-insights', async (req, res) => {
  try {
    const sessions = await retrievalService._fetchCollection('sessions');
    const insights = analyticsService.generatePredictiveInsights(sessions);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/ai/fraud-analysis
 * @desc    Audit security anomalies, travel times, and mock location usage
 */
router.get('/fraud-analysis', async (req, res) => {
  try {
    const logs = await retrievalService._fetchCollection('geofence_logs');
    const sessions = await retrievalService._fetchCollection('sessions');
    const analysis = fraudService.analyzeSecurityAnomalies(logs, sessions);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/ai/coach-report
 * @desc    Get coach coaching hours and productivity metrics
 */
router.get('/coach-report', async (req, res) => {
  try {
    const sessions = await retrievalService._fetchCollection('sessions');
    const report = analyticsService.generateCoachReport(sessions);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/ai/student-summary
 * @desc    Identify inconsistent students and system-wide averages
 */
router.get('/student-summary', async (req, res) => {
  try {
    const students = await retrievalService._fetchCollection('students');
    const summary = analyticsService.generateStudentSummary(students);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/ai/center-analytics
 * @desc    Compare facilities performance, enrolled counts, and risk levels
 */
router.get('/center-analytics', async (req, res) => {
  try {
    const analytics = await retrievalService._fetchCollection('analytics');
    const sessions = await retrievalService._fetchCollection('sessions');
    const performance = analyticsService.generateCenterPerformance(analytics, sessions);
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/ai/predictive-insights
 * @desc    Retrieve historical predictions and trend forecastings
 */
router.get('/predictive-insights', async (req, res) => {
  try {
    const sessions = await retrievalService._fetchCollection('sessions');
    const predictions = analyticsService.generatePredictiveInsights(sessions);
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
