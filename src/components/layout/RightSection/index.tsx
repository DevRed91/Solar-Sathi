'use client';
import LeaderBoard from '@/components/ui/LeaderBoard';
import Testimonial from '@/components/ui/Testimonial';
import { useSolarState } from '@/lib/store';

const RightSection = () => {
  const isHomePage = useSolarState((state) => state.isHomePage);

  if (isHomePage) return;
  return (
    <div className="pointer-events-auto z-0 flex max-w-[360px] flex-col gap-6">
      <LeaderBoard />
      <Testimonial />
    </div>
  );
};

export default RightSection;
