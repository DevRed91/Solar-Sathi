import React from 'react';
import { MetricsCardProps } from '@/types';
import Skeleton from '../Skeleton';
import ShowError from '../ShowError';
import EmptyData from '../EmptyData/EmptyData';

const MetricsCard = ({
  data: { title, metricContents, icon: Icon },
  isLoading,
  isError,
}: {
  data: MetricsCardProps;
  isLoading: boolean;
  isError: boolean;
}) => {
  return (
    <div
      className={`bg-background-dark-200 shadow-smoke flex w-full flex-col ${isError || metricContents?.length === 0 || !metricContents ? 'gap-4' : 'gap-6.5'} rounded-xl border border-neutral-400 px-5 py-4 text-white backdrop:blur-sm`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-dm-sans leading-trim text-[24px] font-medium">
          {title}
        </h3>
        <div className="bg-background-dark-300 w-fit rounded-xl p-[14px]">
          <Icon className="h-9 w-9" />
        </div>
      </div>
      <div className="font-poppins inline-flex flex-grow items-center gap-2 text-[54px]/19">
        {isLoading ? (
          <Skeleton className="h-full !rounded-lg" />
        ) : isError ? (
          <ShowError
            title="Something went wrong"
            description=""
            className="h-fit w-full p-0! [&>div]:mt-0 [&>div]:text-xl [&>svg]:h-10! [&>svg]:w-10!"
          />
        ) : metricContents?.length === 0 || !metricContents ? (
          <EmptyData
            content="No data found"
            className="m-0 h-fit w-full gap-4! [&>div]:text-xl [&>svg]:h-10! [&>svg]:w-10!"
          />
        ) : (
          metricContents?.map((item, index) => (
            <span
              key={index}
              className={`${item.highlighted ? 'text-neutral-dark-500 font-medium' : 'font-semibold text-white'}`}
            >
              {item.text}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default MetricsCard;
