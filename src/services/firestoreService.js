import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  setDoc,
  doc
} from 'firebase/firestore';

/**
 * Saves a coaching session and its attendance to Firestore
 */
export const saveCoachingSession = async (sessionData) => {
  try {
    const sessionRef = await addDoc(collection(db, 'sessions'), {
      ...sessionData,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });
    
    console.log("Session saved with ID: ", sessionRef.id);
    return sessionRef.id;
  } catch (e) {
    console.error("Error adding session: ", e);
    throw e;
  }
};

/**
 * Logs a geofence entry/exit event for fraud detection
 */
export const logGeofenceEvent = async (eventData) => {
  try {
    await addDoc(collection(db, 'geofence_logs'), {
      ...eventData,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error("Error logging geofence event: ", e);
  }
};

/**
 * Gets attendance history for a specific centre
 */
export const getCentreAttendance = async (centreName) => {
  const q = query(collection(db, 'sessions'), where("centre", "==", centreName));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
