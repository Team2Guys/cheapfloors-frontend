import { useEffect, useState } from 'react';

type LocationState = {
  city: string | null;
  country: string | null;
  loading: boolean;
  error: string | null;
};

export const useLocation = (): LocationState => {
  const [state, setState] = useState<LocationState>({
    city: null,
    country: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        city: null,
        country: null,
        loading: false,
        error: 'Geolocation not supported',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Reverse geocoding (OpenStreetMap – free, no key)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();

          setState({
            city:
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              null,
            country: data.address?.country || null,
            loading: false,
            error: null,
          });
        } catch {
          setState({
            city: null,
            country: null,
            loading: false,
            error: 'Unable to fetch location',
          });
        }
      },
      () => {
        setState({
          city: null,
          country: null,
          loading: false,
          error: 'Location permission denied',
        });
      }
    );
  }, []);

  return state;
};
