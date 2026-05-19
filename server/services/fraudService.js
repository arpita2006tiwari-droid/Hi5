class FraudService {
  /**
   * Run multi-vector fraud audits on geofence logs
   * @param {Array} geofenceLogs 
   * @param {Array} sessions 
   */
  analyzeSecurityAnomalies(geofenceLogs = [], sessions = []) {
    const anomalies = [];
    let riskScore = 100; // Perfect health starts at 100

    // 1. Scan geofence logs for mock location or distance violations
    for (const log of geofenceLogs) {
      const coachVal = log.coachName || log.coach;
      const centerVal = log.centerName || log.location || log.centre;
      if (!coachVal) continue;

      if (log.issue && log.issue.toLowerCase().includes('mock location')) {
        anomalies.push({
          type: 'Fake GPS App',
          coach: coachVal,
          coachName: coachVal,
          location: centerVal,
          centerName: centerVal,
          details: `Detected active mock location/spoofing application on device ${log.deviceId || 'unknown'}.`,
          severity: 'high',
          timestamp: log.timestamp
        });
        riskScore -= 10;
      }
      
      if (log.issue && log.issue.toLowerCase().includes('outside radius')) {
        anomalies.push({
          type: 'Geofence Violation',
          coach: coachVal,
          coachName: coachVal,
          location: centerVal,
          centerName: centerVal,
          details: `Attendance marked significantly outside the allowed zone perimeter.`,
          severity: 'high',
          timestamp: log.timestamp
        });
        riskScore -= 8;
      }

      if (log.issue && log.issue.toLowerCase().includes('matches 3 other')) {
        anomalies.push({
          type: 'Duplicate Device Identity',
          coach: coachVal,
          coachName: coachVal,
          location: centerVal,
          centerName: centerVal,
          details: `Multiple coaches sharing device profile fingerprint / MAC addresses.`,
          severity: 'medium',
          timestamp: log.timestamp
        });
        riskScore -= 5;
      }
    }

    // 2. Scan sessions for impossible travel or overlapping timings
    // e.g. same coach doing s1 and s2 on the same day with overlapping times or too fast travel
    const coachSessions = {};
    for (const session of sessions) {
      const coachVal = session.coachName || session.coach;
      if (!coachVal) continue;

      if (!coachSessions[coachVal]) {
        coachSessions[coachVal] = [];
      }
      coachSessions[coachVal].push(session);
    }

    for (const [coach, list] of Object.entries(coachSessions)) {
      // Sort by date/timestamp
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      for (let i = 0; i < list.length - 1; i++) {
        const s1 = list[i];
        const s2 = list[i + 1];
        const s1Center = s1.centerName || s1.centre;
        const s2Center = s2.centerName || s2.centre;
        
        if (s1.date === s2.date && s1Center !== s2Center) {
          // Same day, different centers. If time was tracked, check speed.
          // Since we track morning/evening sessions:
          if (s1.type === s2.type) {
            anomalies.push({
              type: 'Overlapping Session Timing',
              coach: coach,
              coachName: coach,
              location: `${s1Center} & ${s2Center}`,
              centerName: `${s1Center} & ${s2Center}`,
              details: `Coach registered simultaneous ${s1.type} sessions at two separate centers.`,
              severity: 'critical',
              timestamp: s1.date
            });
            riskScore -= 15;
          }
        }
      }
    }

    // Ensure risk score remains bounded [0, 100]
    riskScore = Math.max(0, riskScore);

    return {
      systemHealthScore: riskScore,
      criticalAnomaliesCount: anomalies.filter(a => a.severity === 'high' || a.severity === 'critical').length,
      anomalies
    };
  }
}

module.exports = new FraudService();
