'use client';

import BreadCrumbs from '@/components/ui/BreadCrumbs';
import MetricsCard from '@/components/ui/MetricsCard';
import { DEFAULT_BREADCRUMBS, INITIAL_METRICS_DATA } from '@/data/constants';
import useQueryParams from '@/hooks/useQueryParams';
import {
  useIdleFlagStore,
  useMapStateAndCityState,
  useSolarState,
} from '@/lib/store';
import { formatNumWithUnits } from '@/lib/utils';
import { useGetExpCenter } from '@/services/exp-center-service';
import { BreadCrumbItemType } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const LeftSection = () => {
  const { queryParams, removeParam } = useQueryParams();
  const isHomePage = useSolarState((state) => state.isHomePage);
  const router = useRouter();
  const { setBackToState, setBackToCountry } = useMapStateAndCityState();
  const { setIsHomePage } = useSolarState();
  const getExpCenterQuery = useGetExpCenter();
  const [metricsData, setMetricsData] = useState(INITIAL_METRICS_DATA);
  const { idleFlag, setIdleFlag } = useIdleFlagStore();

  const removeParamsAndUpdateBreadcrumbs = (...params: string[]) => {
    params.forEach((param) => removeParam(param));
    setBreadCrumbs((prev) => prev.filter((b) => !params.includes(b.key)));
  };

  const DEFAULT_BREADCRUMB_CONFIG = {
    ...DEFAULT_BREADCRUMBS[0],
    onClick: () => {
      removeParamsAndUpdateBreadcrumbs('country', 'state', 'city', 'pincode');
      setBackToCountry();
      setIsHomePage(true);
    },
  };

  const [breadCrumbs, setBreadCrumbs] = useState(() => [
    DEFAULT_BREADCRUMB_CONFIG,
  ]);

  const handleUrlCleanupAndReset = () => {
    router.replace('/');
    setBreadCrumbs([DEFAULT_BREADCRUMB_CONFIG]);
    setIsHomePage(true);
  };

  useEffect(() => {
    handleUrlCleanupAndReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (idleFlag) {
      handleUrlCleanupAndReset();
      setBackToCountry();
      setIdleFlag(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idleFlag]);

  const breadcrumbExists = (
    breadcrumbs: BreadCrumbItemType[],
    key: string,
    label: string
  ) =>
    breadcrumbs.some(
      (item: BreadCrumbItemType) => item.key === key && item.label === label
    );

  const createCountryBreadcrumb = (country: string) => ({
    key: 'country',
    label: country,
    onClick: () => {
      removeParamsAndUpdateBreadcrumbs('state', 'city', 'pincode');
      setBackToCountry();
    },
  });

  const createStateBreadcrumb = (state: string) => ({
    key: 'state',
    label: state,
    onClick: () => {
      removeParamsAndUpdateBreadcrumbs('city', 'pincode');
      setBackToState();
    },
  });

  const createCityBreadcrumb = (city: string) => ({
    key: 'city',
    label: city,
    onClick: () => removeParam('pincode'),
  });

  useEffect(() => {
    setBreadCrumbs((prev) => {
      const { country, state, city } = queryParams || {};
      if (!country && !state && !city) {
        return [DEFAULT_BREADCRUMB_CONFIG];
      }

      const updated = [...prev];

      if (country && !breadcrumbExists(updated, 'country', country)) {
        updated.push(createCountryBreadcrumb(country));
      }

      if (state && !breadcrumbExists(updated, 'state', state)) {
        updated.push(createStateBreadcrumb(state));
      }

      if (city && !breadcrumbExists(updated, 'city', city)) {
        updated.push(createCityBreadcrumb(city));
      }

      return updated;
    });

    const updateMetricsData = (data: {
      totalCount: number;
      totalLifetimeSavings: number;
      totalSubsidyAmount: number;
    }) => {
      setMetricsData((prev) => [
        {
          ...prev[0],
          metricContents: formatNumWithUnits({ num: data.totalCount }),
        },
        {
          ...prev[1],
          metricContents: formatNumWithUnits({
            num: data.totalLifetimeSavings,
            isRupees: true,
          }),
        },
        {
          ...prev[2],
          metricContents: formatNumWithUnits({
            num: data.totalSubsidyAmount,
            isRupees: true,
          }),
        },
      ]);
    };

    getExpCenterQuery.mutate(undefined, {
      onSuccess: updateMetricsData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  if (isHomePage) return;
  return (
    <div className="pointer-events-auto z-[1] flex h-full max-w-[320px] min-w-[320px] flex-col gap-5">
      <Image
        width={0}
        height={0}
        src="/icons/logo.svg"
        alt="logo"
        className="mb-3 h-full max-h-37 w-full max-w-52 cursor-pointer"
        onClick={() => setIsHomePage(true)}
        priority
      />

      <BreadCrumbs items={breadCrumbs} />

      <hr className="border-background-dark-100" />

      <div className="grid flex-grow grid-cols-1 gap-5">
        {metricsData?.map((metric, index) => (
          <MetricsCard
            key={index}
            data={metric}
            isLoading={getExpCenterQuery.isPending}
            isError={getExpCenterQuery.isError}
          />
        ))}
      </div>
    </div>
  );
};

export default LeftSection;
