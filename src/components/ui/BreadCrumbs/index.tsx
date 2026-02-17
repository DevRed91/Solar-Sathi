import { ChevronIcon, HomeIcon } from '@/components/icons';
import { BreadCrumbItemType } from '@/types';
import { Fragment, useMemo } from 'react';

const BreadCrumbs = ({ items }: { items: BreadCrumbItemType[] }) => {
  const total = useMemo(() => items?.length, [items]);
  const isTotalOne = useMemo(() => total === 1, [total]);

  return (
    <div
      className="bg-background-dark-300 font-dm-sans border-background-dark-100 flex w-full items-center gap-0.5 rounded-xl border-[1.5px] p-4 text-white"
      aria-label="Breadcrumb"
    >
      {items?.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === total - 1;
        const isSecond = index === 1;
        const isThird = index === 2;

        // Hiding rules at city level (4 items):
        // - hide India (second)
        // - hide Home *label* (keep icon + divider)
        if (total === 4 && isSecond) return null; // skip India

        // Show label: hide Home label if 3+ levels
        const shouldShowLabel = total <= 2 || !isFirst;

        // Divider always after Home when more than 2 levels
        const showHomeDivider = total > 2 && isFirst;

        // Truncate long labels
        const shouldTruncate =
          (total === 2 && isSecond && item.label.length > 11) ||
          (total === 4 && isThird && item.label.length > 7) ||
          (total > 2 && isLast && item.label.length > 7);

        // Don’t show chevron right after Home icon when 3+ levels
        const shouldShowChevron = !isLast && !(isFirst && total > 2);

        return (
          <Fragment key={index}>
            <span
              onClick={() => !isLast && !isTotalOne && item.onClick?.()}
              className={`flex items-center gap-1 text-2xl/[33px] select-none ${
                isLast && !isFirst
                  ? 'text-secondary-500 pointer-events-none font-semibold'
                  : 'font-normal'
              } ${isTotalOne ? 'font-semibold!' : 'cursor-pointer'}`}
            >
              {isFirst && (
                <span
                  className={`m-2 shrink-0 ${showHomeDivider ? 'border-background-dark-100 border-r-2 pr-3' : ''}`}
                >
                  <HomeIcon />
                </span>
              )}

              {shouldShowLabel && (
                <span
                  className={`${shouldTruncate ? 'max-w-20 truncate' : ''} whitespace-nowrap`}
                >
                  {item.label}
                </span>
              )}
            </span>

            {shouldShowChevron && <ChevronIcon className="shrink-0" />}
          </Fragment>
        );
      })}
    </div>
  );
};

export default BreadCrumbs;
