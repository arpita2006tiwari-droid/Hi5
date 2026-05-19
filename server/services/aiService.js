const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require('firebase-admin');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const db = admin.firestore();

/**
 * SPORTIFY RAG (Retrieval-Augmented Generation) Service
 */
class AIService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateIntelligentResponse(query, userRole = 'coach') {
    try {
      // 1. Retrieve Context from Firestore based on query keywords
      const context = await this._retrieveContext(query, userRole);

      // 2. Build the System Prompt
      const systemPrompt = `
        You are the SPORTIFY AI Assistant, a high-end sports-tech intelligence engine.
        Your goal is to provide precise, data-driven insights to ${userRole}s.
        
        CONTEXT DATA FROM SPORTIFY DATABASE:
        ${JSON.stringify(context, null, 2)}
        
        INSTRUCTIONS:
        - Use only the provided context to answer questions about specific data.
        - If the context is missing specific data, explain that you don't have that record yet.
        - Maintain a professional, elite sports-tech tone.
        - For coaches: focus on batch attendance and student consistency.
        - For admins: focus on fraud detection, total hours, and center performance.
        - If suspicious patterns are found in context (e.g. impossible travel), highlight them as "AI FRAUD ALERT".
      `;

      // 3. Generate Content
      const result = await this.model.generateContent([systemPrompt, query]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("AI Service Error:", error);
      return "I'm sorry, I encountered an error while processing your sports intelligence request.";
    }
  }

  async _retrieveContext(query, userRole) {
    const context = {};
    const lowerQuery = query.toLowerCase();

    // Intelligent Retrieval Logic
    if (lowerQuery.includes('attendance') || lowerQuery.includes('student')) {
      const snapshot = await db.collection('sessions').orderBy('timestamp', 'desc').limit(10).get();
      context.recent_sessions = snapshot.docs.map(doc => doc.data());
    }

    if (lowerQuery.includes('fraud') || lowerQuery.includes('suspicious') || lowerQuery.includes('travel')) {
      const snapshot = await db.collection('geofence_logs').limit(20).get();
      context.geofence_activity = snapshot.docs.map(doc => doc.data());
    }

    if (lowerQuery.includes('hours') || lowerQuery.includes('coach')) {
      const snapshot = await db.collection('sessions').limit(50).get();
      // Aggregate hours logic would go here
      context.coach_data = snapshot.docs.map(doc => ({ 
        coach: doc.data().coach, 
        hours: doc.data().hours, 
        centre: doc.data().centre 
      }));
    }

    return context;
  }
}

module.exports = new AIService();
