'use client';

import { Scorer } from '@/lib/helper/animation';
import React, { useEffect, useRef } from 'react';


export default function Scoreboard({value=0}:{value: number}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    Scorer.init();

    Scorer.flip(el, value);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-value') {
          const newValue = el.getAttribute('data-value') || '0';
          Scorer.flip(el, newValue);
        }
      }
    });
    
    observer.observe(el, { attributes: true });

    const interval = setInterval(() => {
      Scorer.init();
      Scorer.flip(el, value); 
    }, 45000);

    return () => {
      Scorer.init();
      Scorer.flip(el, value); 
      observer.disconnect();
      clearInterval(interval);
    };
  }, [value]);

  return (
    <div
      ref={ref}
      className="scorer inline-block"
      data-scorer-digits="5"
      data-divider-size="2"
      data-divider-color="transparent"
      data-bg-color="linear-gradient(180deg, #020319 0%, #373B86 50%, #020319 100%)"
      data-color="white"
      data-card-width="160"
      data-font-size="140px"
      data-height="200"
    />
  );
}
