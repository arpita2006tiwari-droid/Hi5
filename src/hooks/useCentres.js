import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';

export const useCentres = () => {
  const [centres, setCentres] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for real-time updates to the centres collection
    const centresRef = collection(db, 'centres');
    const q = query(centresRef, orderBy('name', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const centresMap = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        centresMap[data.name] = {
          lat: data.lat,
          lng: data.lng,
          radius: data.radius || 100,
          id: doc.id
        };
      });
      setCentres(centresMap);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addCentre = async (centreData) => {
    try {
      await addDoc(collection(db, 'centres'), {
        ...centreData,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding centre:", error);
      throw error;
    }
  };

  return { centres, loading, addCentre };
};
