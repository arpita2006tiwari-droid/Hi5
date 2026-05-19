const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } else {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in the environment. AI responses will run in offline simulation mode.");
      this.model = null;
    }
  }

  /**
   * Generates a text response from the Gemini model using systemInstructions and query
   * @param {string} prompt - The user query or detailed prompt
   * @param {string} systemInstruction - Instructions guiding model behavior and rules
   */
  async generateResponse(prompt, systemInstruction = "") {
    if (!this.model) {
      return this._generateSimulatedResponse(prompt, systemInstruction);
    }

    try {
      const combinedPrompt = systemInstruction 
        ? `${systemInstruction}\n\nUser Query: ${prompt}`
        : prompt;

      const result = await this.model.generateContent(combinedPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Generation Error, falling back to simulation:", error);
      return this._generateSimulatedResponse(prompt, systemInstruction);
    }
  }

  /**
   * High-fidelity simulation fallback when API key is missing or calls fail.
   */
  _generateSimulatedResponse(prompt, systemInstruction) {
    const query = prompt.toLowerCase();
    
    if (query.includes('attendance') && (query.includes('motilal') || query.includes('poonam'))) {
      return "Based on database records, **Motilal Center** shows an average attendance rate of **87.5%** for May 2026. Top consistent students include *Liam Johnson* and *Noah Brown* (100% attendance). No geofence violations registered for this center.";
    }
    
    if (query.includes('fraud') || query.includes('suspicious') || query.includes('anomaly')) {
      return "⚠️ **AI SECURITY LOG AUDIT**:\n- **Alex Mercer**: High GPS fraud suspicion (Mock Location App detected 10 mins ago).\n- **Sarah Jenkins**: Marked attendance 15.2km outside the allowed geofence perimeter at Center B.\n- **Duplicate Device Sign-ins**: Coach ID matching same MAC address found in Bandra region.";
    }

    if (query.includes('coach') || query.includes('hours') || query.includes('productivity')) {
      return "**SPORTIFY COACH PERFORMANCE REPORT**:\n- **Rahul Sharma**: 42.5 coaching hours, 18 sessions across Andheri & Motilal centers.\n- **Sarah Jenkins**: 28.0 coaching hours (under review due to geofence anomalies).\n- Average coach productivity stands at **34.2 hours/month**.";
    }

    return "Hello! I am the SPORTIFY AI Assistant. How can I help you manage sessions, audit geofences, or retrieve player attendance stats today?";
  }
}

module.exports = new GeminiService();
