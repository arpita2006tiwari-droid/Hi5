class MemoryService {
  constructor() {
    // Session context map: sessionId -> message history array
    this.sessions = new Map();
    this.maxHistory = 10; // Keep last 10 messages (5 user, 5 assistant turns)
  }

  /**
   * Retrieves message history for a session
   * @param {string} sessionId 
   */
  getHistory(sessionId) {
    if (!sessionId) return [];
    return this.sessions.get(sessionId) || [];
  }

  /**
   * Appends a message to session history and trims context
   * @param {string} sessionId 
   * @param {string} role - 'user' | 'assistant'
   * @param {string} content 
   */
  addMessage(sessionId, role, content) {
    if (!sessionId) return;
    
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
    }

    const history = this.sessions.get(sessionId);
    history.push({ role, content, timestamp: new Date().toISOString() });

    // Trim history to prevent context window explosion
    if (history.length > this.maxHistory) {
      history.shift();
    }
  }

  /**
   * Formats message history to string for injection into Gemini prompt builder
   * @param {string} sessionId 
   */
  getFormattedHistory(sessionId) {
    const history = this.getHistory(sessionId);
    if (history.length === 0) return "No previous chat history in this session.";

    return history
      .map(msg => `${msg.role === 'user' ? 'User' : 'AI Assistant'}: ${msg.content}`)
      .join('\n');
  }

  /**
   * Clear session history
   * @param {string} sessionId 
   */
  clearSession(sessionId) {
    if (sessionId) {
      this.sessions.delete(sessionId);
    }
  }
}

module.exports = new MemoryService();
