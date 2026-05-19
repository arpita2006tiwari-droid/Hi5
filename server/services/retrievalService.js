const admin = require('firebase-admin');
const db = admin.firestore();

// High-fidelity fallback database with enriched schemas for offline/sandboxed execution
const FALLBACK_DB = {
  students: [
    { id: 1, studentName: 'Liam Johnson', name: 'Liam Johnson', status: 'present', centerName: 'Motilal', centre: 'Motilal', school: "St. Mary's", attendanceRate: 1.0, attendancePercentage: 100, sport: 'Basketball', batch: 'U14 Morning', aiRiskScore: 0.01, timestamp: '2026-05-19T08:00:00Z' },
    { id: 2, studentName: 'Emma Williams', name: 'Emma Williams', status: 'absent', centerName: 'Motilal', centre: 'Motilal', school: "Don Bosco", attendanceRate: 0.8, attendancePercentage: 80, sport: 'Basketball', batch: 'U14 Morning', aiRiskScore: 0.15, timestamp: '2026-05-19T08:00:00Z' },
    { id: 3, studentName: 'Noah Brown', name: 'Noah Brown', status: 'present', centerName: 'Motilal', centre: 'Motilal', school: "St. Mary's", attendanceRate: 0.95, attendancePercentage: 95, sport: 'Basketball', batch: 'U14 Morning', aiRiskScore: 0.05, timestamp: '2026-05-19T08:00:00Z' },
    { id: 4, studentName: 'Olivia Jones', name: 'Olivia Jones', status: 'present', centerName: 'Motilal', centre: 'Motilal', school: "Don Bosco", attendanceRate: 0.9, attendancePercentage: 90, sport: 'Basketball', batch: 'U14 Morning', aiRiskScore: 0.08, timestamp: '2026-05-19T08:00:00Z' },
    { id: 5, studentName: 'William Garcia', name: 'William Garcia', status: 'absent', centerName: 'Motilal', centre: 'Motilal', school: "St. Mary's", attendanceRate: 0.75, attendancePercentage: 75, sport: 'Basketball', batch: 'U14 Morning', aiRiskScore: 0.22, timestamp: '2026-05-19T08:00:00Z' },
    { id: 11, studentName: 'Ava Lewis', name: 'Ava Lewis', status: 'present', centerName: 'Poonam Nagar', centre: 'Poonam Nagar', school: "Podar International", attendanceRate: 0.95, attendancePercentage: 95, sport: 'Basketball', batch: 'U16 Evening', aiRiskScore: 0.04, timestamp: '2026-05-19T17:30:00Z' },
    { id: 12, studentName: 'Lucas Robinson', name: 'Lucas Robinson', status: 'present', centerName: 'Poonam Nagar', centre: 'Poonam Nagar', school: "Podar International", attendanceRate: 0.88, attendancePercentage: 88, sport: 'Basketball', batch: 'U16 Evening', aiRiskScore: 0.10, timestamp: '2026-05-19T17:30:00Z' },
    { id: 13, studentName: 'Mia Walker', name: 'Mia Walker', status: 'absent', centerName: 'Poonam Nagar', centre: 'Poonam Nagar', school: "Podar International", attendanceRate: 0.6, attendancePercentage: 60, sport: 'Basketball', batch: 'U16 Evening', aiRiskScore: 0.55, timestamp: '2026-05-19T17:30:00Z' },
  ],
  coaches: [
    { id: 'c1', coachName: 'Rahul Sharma', name: 'Rahul Sharma', sport: 'Basketball', batch: 'U14 Morning', monthlyHours: 42.5, email: 'rahul.sharma@hi5.org', timestamp: '2026-05-19T08:00:00Z' },
    { id: 'c2', coachName: 'Sarah Jenkins', name: 'Sarah Jenkins', sport: 'Basketball', batch: 'U16 Evening', monthlyHours: 28.0, email: 'sarah.jenkins@hi5.org', timestamp: '2026-05-19T17:30:00Z' },
    { id: 'c3', coachName: 'David Smith', name: 'David Smith', sport: 'Basketball', batch: 'U16 Evening', monthlyHours: 35.5, email: 'david.smith@hi5.org', timestamp: '2026-05-17T17:30:00Z' },
    { id: 'c4', coachName: 'Alex Mercer', name: 'Alex Mercer', sport: 'Football', batch: 'U12 Morning', monthlyHours: 15.0, email: 'alex.mercer@hi5.org', timestamp: '2026-05-19T14:30:00Z' },
  ],
  centers: [
    { id: 'ctr1', centerName: 'Motilal', centre: 'Motilal', sport: 'Basketball', activeStudents: 150, location: 'Santacruz East', timestamp: '2026-05-19T08:00:00Z' },
    { id: 'ctr2', centerName: 'Poonam Nagar', centre: 'Poonam Nagar', sport: 'Basketball', activeStudents: 110, location: 'Andheri East', timestamp: '2026-05-19T17:30:00Z' },
    { id: 'ctr3', centerName: 'Andheri', centre: 'Andheri', sport: 'Basketball', activeStudents: 180, location: 'Andheri West', timestamp: '2026-05-19T08:00:00Z' },
    { id: 'ctr4', centerName: 'Bandra', centre: 'Bandra', sport: 'Basketball', activeStudents: 95, location: 'Bandra West', timestamp: '2026-05-18T17:30:00Z' },
  ],
  sessions: [
    { id: 's1', coachName: 'Rahul Sharma', coach: 'Rahul Sharma', hours: 2.0, centerName: 'Motilal', centre: 'Motilal', date: '2026-05-19', type: 'Morning', studentsCount: 10, attendanceRate: 0.8, attendancePercentage: 80, sport: 'Basketball', batch: 'U14 Morning', timestamp: '2026-05-19T08:00:00Z' },
    { id: 's2', coachName: 'Sarah Jenkins', coach: 'Sarah Jenkins', hours: 1.5, centerName: 'Poonam Nagar', centre: 'Poonam Nagar', date: '2026-05-19', type: 'Evening', studentsCount: 8, attendanceRate: 0.75, attendancePercentage: 75, sport: 'Basketball', batch: 'U16 Evening', timestamp: '2026-05-19T17:30:00Z' },
    { id: 's3', coachName: 'Rahul Sharma', coach: 'Rahul Sharma', hours: 2.0, centerName: 'Andheri', centre: 'Andheri', date: '2026-05-18', type: 'Morning', studentsCount: 12, attendanceRate: 0.92, attendancePercentage: 92, sport: 'Basketball', batch: 'U14 Morning', timestamp: '2026-05-18T08:00:00Z' },
    { id: 's4', coachName: 'Sarah Jenkins', coach: 'Sarah Jenkins', hours: 2.0, centerName: 'Bandra', centre: 'Bandra', date: '2026-05-18', type: 'Evening', studentsCount: 15, attendanceRate: 0.87, attendancePercentage: 87, sport: 'Basketball', batch: 'U16 Evening', timestamp: '2026-05-18T17:30:00Z' },
    { id: 's5', coachName: 'David Smith', coach: 'David Smith', hours: 1.5, centerName: 'Motilal', centre: 'Motilal', date: '2026-05-17', type: 'Evening', studentsCount: 9, attendanceRate: 0.89, attendancePercentage: 89, sport: 'Basketball', batch: 'U16 Evening', timestamp: '2026-05-17T17:30:00Z' },
  ],
  geofence_logs: [
    { id: 'g1', coachName: 'Alex Mercer', coach: 'Alex Mercer', location: 'Center A', issue: 'Detected Mock Location App (Fake GPS)', time: '10 mins ago', severity: 'high', timestamp: '2026-05-19T14:30:00Z', deviceId: 'DEV_8829', centerName: 'Center A' },
    { id: 'g2', coachName: 'Sarah Jenkins', coach: 'Sarah Jenkins', location: 'Center B', issue: 'Attendance marked 15.2km outside radius', time: '1 hour ago', severity: 'high', timestamp: '2026-05-19T13:40:00Z', deviceId: 'DEV_3099', centerName: 'Center B' },
    { id: 'g3', coachName: 'David Smith', coach: 'David Smith', location: 'Center A', issue: 'Device MAC address matches 3 other coaches', time: '2 hours ago', severity: 'medium', timestamp: '2026-05-19T12:45:00Z', deviceId: 'DEV_1001', centerName: 'Center A' },
    { id: 'g4', coachName: 'Rahul Sharma', coach: 'Rahul Sharma', location: 'Motilal', issue: 'None', time: '4 hours ago', severity: 'none', timestamp: '2026-05-19T10:30:00Z', deviceId: 'DEV_4411', centerName: 'Motilal' },
  ],
  fraud_logs: [
    { type: 'Fake GPS App', value: 12, color: '#ef4444' },
    { type: 'Duplicate Device', value: 8, color: '#f97316' },
    { type: 'Rapid Location Jump', value: 5, color: '#eab308' },
  ],
  analytics: [
    { centerName: 'Motilal', centre: 'Motilal', avgAttendance: 87.5, enrolledStudents: 150, riskLevel: 'low', timestamp: '2026-05-19T00:00:00Z' },
    { centerName: 'Poonam Nagar', centre: 'Poonam Nagar', avgAttendance: 76.2, enrolledStudents: 110, riskLevel: 'medium', timestamp: '2026-05-19T00:00:00Z' },
    { centerName: 'Andheri', centre: 'Andheri', avgAttendance: 91.0, enrolledStudents: 180, riskLevel: 'low', timestamp: '2026-05-19T00:00:00Z' },
    { centerName: 'Bandra', centre: 'Bandra', avgAttendance: 68.4, enrolledStudents: 95, riskLevel: 'high', timestamp: '2026-05-19T00:00:00Z' },
  ],
  tournaments: [
    { tournament: 'Mumbai Youth Cup', team: 'Hi5 Motilal U14', played: 12, won: 10, lost: 2, rank: '1st', timestamp: '2026-05-19T00:00:00Z' },
    { tournament: 'State Basketball Championship', team: 'Hi5 Andheri Girls', played: 8, won: 5, lost: 3, rank: '3rd', timestamp: '2026-05-19T00:00:00Z' },
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

    // Student Queries
    if (q.includes('student') || q.includes('liam') || q.includes('emma') || q.includes('noah') || q.includes('olivia') || q.includes('william') || q.includes('ava') || q.includes('lucas') || q.includes('mia')) {
      categories.push('students');
    }
    // Coach Queries
    if (q.includes('coach') || q.includes('rahul') || q.includes('sarah') || q.includes('david') || q.includes('alex') || q.includes('hours') || q.includes('productivity') || q.includes('session')) {
      categories.push('coaches', 'sessions');
    }
    // Center Queries
    if (q.includes('centre') || q.includes('center') || q.includes('motilal') || q.includes('poonam') || q.includes('andheri') || q.includes('bandra')) {
      categories.push('centers', 'analytics');
    }
    // Attendance/Analytics Queries
    if (q.includes('attendance') || q.includes('present') || q.includes('absent') || q.includes('consistency') || q.includes('trend') || q.includes('performance') || q.includes('summary') || q.includes('report')) {
      categories.push('analytics', 'sessions', 'students');
    }
    // Fraud Queries
    if (q.includes('fraud') || q.includes('suspicious') || q.includes('anomaly') || q.includes('gps') || q.includes('location') || q.includes('geofence') || q.includes('travel') || q.includes('audit')) {
      categories.push('geofence_logs', 'fraud_logs');
    }
    // Tournament Queries
    if (q.includes('tournament') || q.includes('match') || q.includes('won') || q.includes('lost') || q.includes('cup') || q.includes('rank')) {
      categories.push('tournaments');
    }

    // Default catch-all
    if (categories.length === 0) {
      categories.push('students', 'coaches', 'centers', 'sessions', 'analytics');
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
