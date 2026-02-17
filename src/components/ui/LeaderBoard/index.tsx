'use client';
import { LeaderBoardIcon } from '@/components/icons';
import LeaderBoardRow from './LeaderBoardRow';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetExpCenter } from '@/services/exp-center-service';
import { useEffect, useState } from 'react';
import { LeaderBoardData } from '@/types';
import Skeleton from '../Skeleton';
import ShowError from '../ShowError';
import { CurrentLocationType } from '@/components/layout/MapSection';
import EmptyData from '../EmptyData/EmptyData';

const LeaderBoard = () => {
  const { queryParams } = useQueryParams();
  const getExpCenterQuery = useGetExpCenter();
  const [leaderBoardData, setLeaderBoardData] = useState<LeaderBoardData[]>([]);

  useEffect(() => {
    getExpCenterQuery.mutate(undefined, {
      onSuccess: (data) =>
        setLeaderBoardData(
          data.data
            .slice(0, 3)
            .map(
              (
                item: CurrentLocationType & { count: number },
                index: number
              ) => ({
                rank: index + 1,
                city: item.state ?? item.city ?? item.pincode,
                homesSolarized: item.count.toLocaleString(),
              })
            )
        ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  return (
    <div className="bg-background-dark-200 shadow-smoke flex flex-col gap-8 rounded-xl border border-neutral-400 px-5 py-6 backdrop-blur-sm">
      <div className="flex gap-3">
        <LeaderBoardIcon className="min-w-8" />
        <span className="font-dm-sans flex gap-1 overflow-hidden text-2xl/[33px] font-medium tracking-[-0.96px] whitespace-nowrap text-white">
          <span>Top</span>
          <span className="overflow-hidden text-ellipsis">
            {queryParams.city ?? queryParams.state ?? 'SolarSquare'}
          </span>
          <span>
            {queryParams.city
              ? 'PIN Codes'
              : queryParams.state
                ? 'Cities'
                : 'States'}
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between gap-4">
          {[
            'Rank',
            queryParams.city
              ? 'PIN Code'
              : queryParams.state
                ? 'City'
                : 'State',
            'Homes Solarized',
          ].map((item, index) => (
            <div
              key={index}
              className={`font-dm-sans leading-trim text-neutral-450 ${index === 2 ? 'text-right' : 'text-left'} ${index === 1 ? 'flex-grow' : ''} text-lg font-normal`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          {getExpCenterQuery.isPending ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className={`h-12 rounded-lg ${index !== 2 ? 'mb-[19px]' : ''}`}
              />
            ))
          ) : getExpCenterQuery.isError ? (
            <ShowError
              title="Something went wrong"
              description="Error loading leaderboard. Please try again later."
              className="h-fit rounded-2xl p-0! [&>div]:mt-0 [&>div]:text-2xl [&>p]:text-lg [&>svg]:mt-3!"
            />
          ) : leaderBoardData.length === 0 ? (
            <EmptyData
              content="No data found"
              className="my-6 h-fit [&>svg]:h-16! [&>svg]:w-16!"
            />
          ) : (
            leaderBoardData?.map((city, index) => (
              <LeaderBoardRow
                key={city.rank}
                rank={city.rank}
                city={city.city}
                isLastRow={index === leaderBoardData.length - 1}
                homesSolarized={city.homesSolarized}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
