import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgAttendance: 0,
    totalHours: 0,
    recentSessions: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionsRef = collection(db, 'sessions');
        const q = query(sessionsRef, orderBy('timestamp', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        
        let totalHours = 0;
        let totalAttendance = 0;
        let sessionCount = 0;
        const sessions = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalHours += data.hours || 0;
          
          // Calculate avg attendance for this session
          if (data.students && data.students.length > 0) {
            const presentCount = data.students.filter(s => s.status === 'present').length;
            totalAttendance += (presentCount / data.students.length) * 100;
          }
          
          sessionCount++;
          sessions.push({ id: doc.id, ...data });
        });

        setStats({
          totalStudents: 128, // Mock for now until we have a students collection
          avgAttendance: sessionCount > 0 ? Math.round(totalAttendance / sessionCount) : 0,
          totalHours: Math.round(totalHours),
          recentSessions: sessions
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, loading };
};
