import { EmptyDataIcon } from '@/components/icons';
import { EmptyDataProps } from '@/types';

const EmptyData = ({ content, className }: EmptyDataProps) => {
  return (
    <div
      className={`font-dm-sans col-span-full flex h-80 flex-col items-center justify-center gap-6 ${className}`}
    >
      <EmptyDataIcon className="fill-neutral-dark-500 !h-28 !w-28" />
      <div className="text-neutral-dark-500 text-2xl font-medium">
        {content}
      </div>
    </div>
  );
};

export default EmptyData;
