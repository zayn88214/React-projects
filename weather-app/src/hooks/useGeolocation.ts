import { useCallback, useState } from 'react';

interface GeoState {
  status: 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';
  coords: { latitude: number; longitude: number } | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ status: 'idle', coords: null });

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'unsupported', coords: null });
      return;
    }
    setState((s) => ({ ...s, status: 'requesting' }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: 'granted',
          coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
        });
      },
      () => {
        setState({ status: 'denied', coords: null });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  return { ...state, request };
}
