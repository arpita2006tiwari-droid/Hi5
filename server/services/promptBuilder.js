class PromptBuilder {
  /**
   * Formats the retrieved Firestore collections into structured, readable markdown text.
   * @param {Object} context 
   */
  formatContextToReadableText(context) {
    let output = "";

    if (context.students && context.students.length > 0) {
      output += "### 🎒 REGISTERED STUDENTS\n";
      output += "| Student ID | Student Name | Sport | Batch | Center | Attendance Rate | AI Risk Score |\n";
      output += "|---|---|---|---|---|---|---|\n";
      for (const s of context.students) {
        const studentName = s.studentName || s.name || "N/A";
        const centerName = s.centerName || s.centre || "N/A";
        const rate = s.attendancePercentage !== undefined ? `${s.attendancePercentage}%` : (s.attendanceRate !== undefined ? `${Math.round(s.attendanceRate * 100)}%` : "N/A");
        const risk = s.aiRiskScore !== undefined ? s.aiRiskScore : "N/A";
        output += `| ${s.id || 'N/A'} | ${studentName} | ${s.sport || 'Basketball'} | ${s.batch || 'N/A'} | ${centerName} | ${rate} | ${risk} |\n`;
      }
      output += "\n";
    }

    if (context.coaches && context.coaches.length > 0) {
      output += "### 📋 ACTIVE COACHES\n";
      output += "| Coach Name | Sport | Assigned Batch | Monthly Coaching Hours | Email Contact |\n";
      output += "|---|---|---|---|---|\n";
      for (const c of context.coaches) {
        const coachName = c.coachName || c.name || "N/A";
        output += `| ${coachName} | ${c.sport || 'N/A'} | ${c.batch || 'N/A'} | ${c.monthlyHours || 'N/A'} hrs | ${c.email || 'N/A'} |\n`;
      }
      output += "\n";
    }

    if (context.centers && context.centers.length > 0) {
      output += "### 📍 OPERATIONAL CENTERS\n";
      output += "| Center Name | Location | Assigned Sport | Enrolled Active Students |\n";
      output += "|---|---|---|---|\n";
      for (const ctr of context.centers) {
        const centerName = ctr.centerName || ctr.centre || "N/A";
        output += `| ${centerName} | ${ctr.location || 'N/A'} | ${ctr.sport || 'N/A'} | ${ctr.activeStudents || 'N/A'} |\n`;
      }
      output += "\n";
    }

    if (context.sessions && context.sessions.length > 0) {
      output += "### ⏱️ ATTENDANCE SESSIONS LOGS\n";
      output += "| Date | Session Type | Coach | Center | Sport | Batch | Students Count | Attendance Rate |\n";
      output += "|---|---|---|---|---|---|---|---|\n";
      for (const s of context.sessions) {
        const coachName = s.coachName || s.coach || "N/A";
        const centerName = s.centerName || s.centre || "N/A";
        const rate = s.attendancePercentage !== undefined ? `${s.attendancePercentage}%` : (s.attendanceRate !== undefined ? `${Math.round(s.attendanceRate * 100)}%` : "N/A");
        output += `| ${s.date || 'N/A'} | ${s.type || 'N/A'} | ${coachName} | ${centerName} | ${s.sport || 'N/A'} | ${s.batch || 'N/A'} | ${s.studentsCount || 0} | ${rate} |\n`;
      }
      output += "\n";
    }

    if (context.geofence_logs && context.geofence_logs.length > 0) {
      output += "### ⚠️ GEOFENCE LOGS (SECURITY EVENTS)\n";
      output += "| Time/Age | Coach Name | Location | Alert Issue Detail | Severity Level | Device ID |\n";
      output += "|---|---|---|---|---|---|\n";
      for (const log of context.geofence_logs) {
        const coachName = log.coachName || log.coach || "N/A";
        const centerName = log.centerName || log.location || log.centre || "N/A";
        output += `| ${log.time || 'N/A'} | ${coachName} | ${centerName} | ${log.issue || 'None'} | ${log.severity || 'N/A'} | ${log.deviceId || 'N/A'} |\n`;
      }
      output += "\n";
    }

    if (context.fraud_logs && context.fraud_logs.length > 0) {
      output += "### 🚨 FRAUD ALERTS SUMMARY\n";
      for (const f of context.fraud_logs) {
        output += `- **${f.type}**: ${f.value} occurrences\n`;
      }
      output += "\n";
    }

    if (context.analytics && context.analytics.length > 0) {
      output += "### 📊 CENTER METRICS & RISK LEVEL\n";
      output += "| Center | Avg Attendance | Enrolled Students | Security Risk Level |\n";
      output += "|---|---|---|---|\n";
      for (const a of context.analytics) {
        const centerName = a.centerName || a.centre || "N/A";
        output += `| ${centerName} | ${a.avgAttendance}% | ${a.enrolledStudents} | ${a.riskLevel} |\n`;
      }
      output += "\n";
    }

    if (context.tournaments && context.tournaments.length > 0) {
      output += "### 🏆 TOURNAMENTS PERFORMANCE\n";
      for (const t of context.tournaments) {
        output += `- **${t.tournament}**: Team *${t.team}* played ${t.played}, won ${t.won}, lost ${t.lost}. Current Standing: ${t.rank}\n`;
      }
      output += "\n";
    }

    if (!output) {
      output = "No database context records returned matching current request classifications.\n";
    }

    return output;
  }

  /**
   * Constructs the system prompt for the Gemini LLM
   * @param {string} userRole - 'coach' | 'admin'
   * @param {Object} context - Retrieved Firestore context dataset
   * @param {string} conversationHistory - Formatted session chat history
   */
  buildSystemPrompt(userRole, context, conversationHistory) {
    const readableContext = this.formatContextToReadableText(context);

    return `
You are the SPORTIFY AI Assistant, an elite sports-tech intelligence engine powering the Hi5 Foundation platform.
Your persona is a professional, knowledgeable, and data-driven sports operations specialist.

USER ROLE: ${userRole.toUpperCase()}
Ensure your responses match the privileges and expectations of this role:
- Coaches: focus on attendance metrics, student consistency, basketball drills, and coaching productivity.
- Admins: focus on security geofence audits, fraud alerts, aggregated statistics, and center performance comparison.

CONVERSATION HISTORY:
${conversationHistory}

DATABASE CONTEXT DATA:
${readableContext}

INSTRUCTIONS & RULES:
1. **Source Authenticity**: Answer queries ONLY using the provided "DATABASE CONTEXT DATA". Do NOT hallucinate, invent, or assume stats, student names, or metrics not present in the context.
2. **Missing Information**: If the context does not contain sufficient details to answer the question, state clearly: "I'm sorry, I could not find that specific record in the database."
3. **Tone and Style**: Keep responses professional, highly organized, and concise. Use clear headers and markdown formatting (bolding, bullet points).
4. **Anomalies / Fraud Detection**: If geofence logs are in the context and issues/violations (e.g. mock locations, rapid location jumps) are detected, highlight them in a specific "⚠️ AI SECURITY LOG ALERT" section with an intelligent plain-English explanation of why this is suspicious.
5. **No Graph Repetitions**: Do not output raw JSON or mock charts within text responses. Explain data trends clearly and concisely.
`;
  }
}

module.exports = new PromptBuilder();
