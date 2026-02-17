import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useIdleFlagStore,
  useMapStateAndCityState,
  useSolarState,
} from '@/lib/store';

const BackToHome = ({ className }: { className?: string }) => {
  const queryClient = useQueryClient();
  const solarState = useSolarState();
  const mapStateAndCityState = useMapStateAndCityState();
  const idleFlagStore = useIdleFlagStore();
  const [counter, setCounter] = useState(10);

  const resetAndGoHome = useCallback(() => {
    // storage clear
    localStorage.clear();
    queryClient.clear();
    // store reset
    solarState.reset();
    mapStateAndCityState.reset();
    idleFlagStore.setIdleFlag(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient]);

  useEffect(() => {
    if (counter <= 0) {
      resetAndGoHome();
      return;
    }

    const timer = setTimeout(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter, resetAndGoHome]);

  return (
    <div
      className={`font-poppins cursor-pointer text-2xl leading-6 whitespace-nowrap text-white underline ${className}`}
      onClick={resetAndGoHome}
    >
      Back To Home ({counter}s)
    </div>
  );
};

export default BackToHome;
