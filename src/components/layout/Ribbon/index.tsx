'use client';
import { RIBBON_DATA } from '@/data/constants';
import { useSolarState } from '@/lib/store';
import { useEffect, useState } from 'react';

const Ribbon = () => {
  const isHomePage = useSolarState((state) => state.isHomePage);
  const [index, setIndex] = useState(
    Math.floor(Math.random() * RIBBON_DATA.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % RIBBON_DATA.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  if (isHomePage) return;
  return (
    <div className="border-background-dark-200 bg-primary-500 leading-trim font-dm-sans absolute inset-x-0 bottom-0 z-[1000] flex h-[74px] items-center justify-center border py-4 text-[32px] font-semibold text-white shadow-(--ribbon-shadow)">
      {RIBBON_DATA[index]}
    </div>
  );
};

export default Ribbon;
