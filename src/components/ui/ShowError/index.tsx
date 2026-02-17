import { AlertCircleIcon } from '@/components/icons';
import { ShowErrorProps } from '@/types';

const ShowError = ({ title, description, className }: ShowErrorProps) => {
  return (
    <div
      className={`font-dm-sans col-span-full flex h-80 flex-col items-center justify-center gap-2.5 p-6 text-center text-white ${className}`}
    >
      <AlertCircleIcon className="h-12 w-12 fill-red-800" />
      <div className="mt-4 text-3xl font-medium">{title}</div>
      <p className="text-neutral-dark-500 text-2xl">{description}</p>
    </div>
  );
};

export default ShowError;
