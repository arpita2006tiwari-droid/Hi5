const geminiService = require('./geminiService');
const retrievalService = require('./retrievalService');
const memoryService = require('./memoryService');
const promptBuilder = require('./promptBuilder');
const fraudService = require('./fraudService');
const analyticsService = require('./analyticsService');

class RAGService {
  /**
   * Main query execution flow
   * @param {string} queryText - User's query
   * @param {string} userRole - User's role ('coach' | 'admin')
   * @param {string} sessionId - Conversation session identifier
   */
  async processQuery(queryText, userRole = 'coach', sessionId = 'default-session') {
    try {
      // 1. Retrieve raw database documents
      const context = await retrievalService.retrieveContext(queryText, userRole);

      // 2. Perform deep analytics or fraud calculations if requested
      const lowerQuery = queryText.toLowerCase();
      if (lowerQuery.includes('fraud') || lowerQuery.includes('suspicious') || lowerQuery.includes('anomaly') || lowerQuery.includes('travel')) {
        context.fraud_analysis = fraudService.analyzeSecurityAnomalies(
          context.geofence_logs,
          context.sessions
        );
      }
      
      if (lowerQuery.includes('coach') || lowerQuery.includes('hours') || lowerQuery.includes('productivity')) {
        context.coach_report = analyticsService.generateCoachReport(context.sessions);
      }
      
      if (lowerQuery.includes('student') || lowerQuery.includes('attendance rate') || lowerQuery.includes('consistency')) {
        context.student_summary = analyticsService.generateStudentSummary(context.students);
      }
      
      if (lowerQuery.includes('centre') || lowerQuery.includes('center') || lowerQuery.includes('compare')) {
        context.center_performance = analyticsService.generateCenterPerformance(
          context.analytics,
          context.sessions
        );
      }

      if (lowerQuery.includes('predict') || lowerQuery.includes('forecast') || lowerQuery.includes('trend')) {
        context.predictive_insights = analyticsService.generatePredictiveInsights(context.sessions);
      }

      // 3. Get conversational history from memory
      const conversationHistory = memoryService.getFormattedHistory(sessionId);

      // 4. Construct instruction and prompt
      const systemInstruction = promptBuilder.buildSystemPrompt(userRole, context, conversationHistory);

      // 5. Query Gemini LLM
      const reply = await geminiService.generateResponse(queryText, systemInstruction);

      // 6. Save interactions to short-term memory
      memoryService.addMessage(sessionId, 'user', queryText);
      memoryService.addMessage(sessionId, 'assistant', reply);

      return reply;
    } catch (error) {
      console.error("RAG Service Orchestration Error:", error);
      return "I encountered a failure while orchestrating RAG context. Please retry.";
    }
  }
}

module.exports = new RAGService();
