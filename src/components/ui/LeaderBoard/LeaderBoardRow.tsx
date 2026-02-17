import { LeaderBoardData } from '@/types';

const LeaderBoardRow = ({
  rank,
  city,
  homesSolarized,
  isLastRow,
}: LeaderBoardData) => (
  <div
    className={`${isLastRow ? '' : 'border-b'} border-background-dark-100 flex items-center justify-between gap-8 px-2 py-5`}
  >
    <div className="font-dm-sans leading-trim flex h-5 w-5 items-center justify-center text-xl font-semibold text-white">
      {rank}
    </div>
    <div className="font-dm-sans leading-trim max-w-[200px] flex-grow text-xl font-normal text-white">
      {city}
    </div>
    <div className="font-dm-sans leading-trim text-right text-xl font-semibold text-white">
      {homesSolarized}
    </div>
  </div>
);

export default LeaderBoardRow;
