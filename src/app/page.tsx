'use client';
import { useSolarState } from '@/lib/store';
import dynamic from 'next/dynamic';

const MapSection = dynamic(() => import('@/components/layout/MapSection'), {
  ssr: false,
});
const LandingPageMap = dynamic(
  () => import('@/components/layout/LandingPage'),
  {
    ssr: false,
  }
);

export default function Home() {
  const { isHomePage } = useSolarState();

  return (
    <div className="relative">
      {isHomePage && (
        <div className="absolute inset-0 z-[999]">
          <LandingPageMap />
        </div>
      )}
      <MapSection />
    </div>
  );
}
