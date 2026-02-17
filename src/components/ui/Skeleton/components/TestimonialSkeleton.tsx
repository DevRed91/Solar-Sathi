import Skeleton from '..';

const TestimonialSkeleton = () => {
  return (
    <div className="bg-background-dark-200 flex w-[360px] flex-grow flex-col gap-5 rounded-2xl border border-neutral-100 p-5">
      <div className="relative flex-grow">
        <Skeleton className="h-full !rounded-lg" />
        <div className="absolute bottom-4 left-4 z-[3] flex w-1/2 flex-col gap-2">
          <Skeleton />
          <Skeleton className="max-w-1/2" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[200px]" />
        <Skeleton className="max-w-1/2" />
      </div>
    </div>
  );
};

export default TestimonialSkeleton;
