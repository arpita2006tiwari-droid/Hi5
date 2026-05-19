const admin = require('firebase-admin');
const db = admin.firestore();

// High-fidelity fallback database for offline/sandboxed execution
const FALLBACK_DB = {
  students: [
    { id: 1, name: 'Liam Johnson', status: 'present', centre: 'Motilal', school: "St. Mary's", attendanceRate: 1.0 },
    { id: 2, name: 'Emma Williams', status: 'absent', centre: 'Motilal', school: "Don Bosco", attendanceRate: 0.8 },
    { id: 3, name: 'Noah Brown', status: 'present', centre: 'Motilal', school: "St. Mary's", attendanceRate: 0.95 },
    { id: 4, name: 'Olivia Jones', status: 'present', centre: 'Motilal', school: "Don Bosco", attendanceRate: 0.9 },
    { id: 5, name: 'William Garcia', status: 'absent', centre: 'Motilal', school: "St. Mary's", attendanceRate: 0.75 },
    { id: 11, name: 'Ava Lewis', status: 'present', centre: 'Poonam Nagar', school: "Podar International", attendanceRate: 0.95 },
    { id: 12, name: 'Lucas Robinson', status: 'present', centre: 'Poonam Nagar', school: "Podar International", attendanceRate: 0.88 },
    { id: 13, name: 'Mia Walker', status: 'absent', centre: 'Poonam Nagar', school: "Podar International", attendanceRate: 0.6 },
  ],
  sessions: [
    { id: 's1', coach: 'Rahul Sharma', hours: 2.0, centre: 'Motilal', date: '2026-05-19', type: 'Morning', studentsCount: 10, attendanceRate: 0.8 },
    { id: 's2', coach: 'Sarah Jenkins', hours: 1.5, centre: 'Poonam Nagar', date: '2026-05-19', type: 'Evening', studentsCount: 8, attendanceRate: 0.75 },
    { id: 's3', coach: 'Rahul Sharma', hours: 2.0, centre: 'Andheri', date: '2026-05-18', type: 'Morning', studentsCount: 12, attendanceRate: 0.92 },
    { id: 's4', coach: 'Sarah Jenkins', hours: 2.0, centre: 'Bandra', date: '2026-05-18', type: 'Evening', studentsCount: 15, attendanceRate: 0.87 },
    { id: 's5', coach: 'David Smith', hours: 1.5, centre: 'Motilal', date: '2026-05-17', type: 'Evening', studentsCount: 9, attendanceRate: 0.89 },
  ],
  geofence_logs: [
    { id: 'g1', coach: 'Alex Mercer', location: 'Center A', issue: 'Detected Mock Location App (Fake GPS)', time: '10 mins ago', severity: 'high', timestamp: '2026-05-19T14:30:00Z', deviceId: 'DEV_8829' },
    { id: 'g2', coach: 'Sarah Jenkins', location: 'Center B', issue: 'Attendance marked 15.2km outside radius', time: '1 hour ago', severity: 'high', timestamp: '2026-05-19T13:40:00Z', deviceId: 'DEV_3099' },
    { id: 'g3', coach: 'David Smith', location: 'Center A', issue: 'Device MAC address matches 3 other coaches', time: '2 hours ago', severity: 'medium', timestamp: '2026-05-19T12:45:00Z', deviceId: 'DEV_1001' },
    { id: 'g4', coach: 'Rahul Sharma', location: 'Motilal', issue: 'None', time: '4 hours ago', severity: 'none', timestamp: '2026-05-19T10:30:00Z', deviceId: 'DEV_4411' },
  ],
  fraud_logs: [
    { type: 'Fake GPS App', value: 12, color: '#ef4444' },
    { type: 'Duplicate Device', value: 8, color: '#f97316' },
    { type: 'Rapid Location Jump', value: 5, color: '#eab308' },
  ],
  analytics: [
    { centre: 'Motilal', avgAttendance: 87.5, enrolledStudents: 150, riskLevel: 'low' },
    { centre: 'Poonam Nagar', avgAttendance: 76.2, enrolledStudents: 110, riskLevel: 'medium' },
    { centre: 'Andheri', avgAttendance: 91.0, enrolledStudents: 180, riskLevel: 'low' },
    { centre: 'Bandra', avgAttendance: 68.4, enrolledStudents: 95, riskLevel: 'high' },
  ],
  tournaments: [
    { tournament: 'Mumbai Youth Cup', team: 'Hi5 Motilal U14', played: 12, won: 10, lost: 2, rank: '1st' },
    { tournament: 'State Basketball Championship', team: 'Hi5 Andheri Girls', played: 8, won: 5, lost: 3, rank: '3rd' },
  ]
};

class RetrievalService {
  /**
   * Classifies user query to determine necessary collections
   * @param {string} query 
   */
  classifyQuery(query) {
    const q = query.toLowerCase();
    const categories = [];

    if (q.includes('attendance') || q.includes('present') || q.includes('absent') || q.includes('consistency') || q.includes('student')) {
      categories.push('attendance', 'students');
    }
    if (q.includes('fraud') || q.includes('suspicious') || q.includes('anomaly') || q.includes('gps') || q.includes('location') || q.includes('geofence') || q.includes('travel')) {
      categories.push('geofence_logs', 'fraud_logs');
    }
    if (q.includes('coach') || q.includes('hours') || q.includes('productivity') || q.includes('session')) {
      categories.push('sessions');
    }
    if (q.includes('centre') || q.includes('center') || q.includes('analytics') || q.includes('performance') || q.includes('summary')) {
      categories.push('analytics', 'sessions');
    }
    if (q.includes('tournament') || q.includes('match') || q.includes('won') || q.includes('lost') || q.includes('cup')) {
      categories.push('tournaments');
    }

    // Default catch-all
    if (categories.length === 0) {
      categories.push('students', 'sessions', 'analytics');
    }

    return [...new Set(categories)];
  }

  /**
   * Universal retrieval method matching query classifications
   */
  async retrieveContext(queryText, userRole = 'coach') {
    const categories = this.classifyQuery(queryText);
    const context = {};

    for (const category of categories) {
      context[category] = await this._fetchCollection(category);
    }

    // Context filter based on Role-Based Access Control (RBAC)
    if (userRole === 'coach') {
      // Coaches shouldn't view system-wide fraud alerts/logs directly via universal search
      delete context.geofence_logs;
      delete context.fraud_logs;
    }

    return context;
  }

  /**
   * Dynamic collector fetching from Firestore or using the offline database fallback
   */
  async _fetchCollection(collectionName) {
    try {
      const snapshot = await db.collection(collectionName).limit(30).get();
      if (snapshot.empty) {
        return FALLBACK_DB[collectionName] || [];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      // Graceful local development fallback
      return FALLBACK_DB[collectionName] || [];
    }
  }
}

module.exports = new RetrievalService();
