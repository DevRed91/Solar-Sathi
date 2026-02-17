'use client';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useIdleFlagStore,
  useMapStateAndCityState,
  useSolarState,
} from '@/lib/store';

const useIdleTimeout = (timeout = 120000) => {
  const queryClient = useQueryClient();
  const solarState = useSolarState();
  const mapStateAndCityState = useMapStateAndCityState();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { setIdleFlag } = useIdleFlagStore();
  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      localStorage.clear();
      queryClient.clear();
      solarState.reset();
      mapStateAndCityState.reset();
      mapStateAndCityState.setBackToCountry();
      setIdleFlag(true);
    }, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeout]);
};

export default useIdleTimeout;
