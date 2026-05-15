import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({
    coords: null,
    accuracy: null,
    error: null,
    loading: true,
    isMocked: false
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false
      }));
      return;
    }

    const handleSuccess = (position) => {
      // Basic mock location detection for some browsers (if supported)
      const isMocked = position.mocked || (position.coords && position.coords.isMocked);
      
      setLocation({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        accuracy: position.coords.accuracy,
        error: null,
        loading: false,
        isMocked: !!isMocked
      });
    };

    const handleError = (error) => {
      setLocation(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
        ...options
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

  return location;
};
