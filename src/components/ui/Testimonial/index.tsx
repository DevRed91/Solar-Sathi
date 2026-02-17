'use client';
import { ArrowIcon, QuotesIcon } from '@/components/icons';
import { useGetTestimonials } from '@/services/testimonial-service';
import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import TestimonialSkeleton from '../Skeleton/components/TestimonialSkeleton';
import ShowError from '../ShowError';
import EmptyData from '../EmptyData/EmptyData';
import useQueryParams from '@/hooks/useQueryParams';
import { STATE_NAME_DATA, STATE_SHORT_FORMS } from '@/data/constants';
import { shuffleArray, toTitleCase } from '@/lib/utils';

const Testimonial = () => {
  const getTestimonialsQuery = useGetTestimonials();
  const { queryParams } = useQueryParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const allTestimonials = getTestimonialsQuery?.data ?? [];

  const displayTestimonials = useMemo(() => {
    if (!getTestimonialsQuery.isSuccess) return [];

    const puneTestimonials = allTestimonials.filter(
      (item) => item.address === 'Pune, MH'
    );
    const nagpurTestimonials = allTestimonials.filter(
      (item) => item.address === 'Nagpur, MH'
    );
    const kanpurTestimonials = allTestimonials.filter(
      (item) => item.address === 'Kanpur, UP'
    );
    const specificTestimonials = allTestimonials.filter(
      (item) =>
        item.address !== 'Pune, MH' &&
        item.address !== 'Nagpur, MH' &&
        item.address !== 'Lucknow, UP' &&
        item.address !== 'Bhopal, MP' &&
        item.address !== 'Kanpur, MP' &&
        (queryParams.city
          ? item.address.includes(queryParams.city)
          : queryParams.state
            ? item.address.includes(
                STATE_SHORT_FORMS[
                  toTitleCase(
                    queryParams.state
                  ) as (typeof STATE_NAME_DATA)[number]
                ]
              )
            : false)
    );

    return [
      ...shuffleArray(kanpurTestimonials),
      ...shuffleArray(nagpurTestimonials),
      ...shuffleArray(puneTestimonials),
      ...specificTestimonials,
    ];
  }, [queryParams.state, queryParams.city, getTestimonialsQuery.isSuccess]);

  const currentTestimonial =
    displayTestimonials[currentIndex % displayTestimonials.length];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayTestimonials.length - 1 : prevIndex - 1
    );
  }, [displayTestimonials.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === displayTestimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [displayTestimonials.length]);

  useEffect(() => {
    if (!isAutoPlaying || displayTestimonials.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [handleNext, isAutoPlaying, displayTestimonials.length]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const handleManualPrev = () => {
    setIsAutoPlaying(false);
    handlePrev();
    setTimeout(() => setIsAutoPlaying(true), 2000);
  };

  const handleManualNext = () => {
    setIsAutoPlaying(false);
    handleNext();
    setTimeout(() => setIsAutoPlaying(true), 2000);
  };

  if (getTestimonialsQuery?.isPending) return <TestimonialSkeleton />;

  if (getTestimonialsQuery?.isError)
    return (
      <ShowError
        title="Something went wrong!"
        description="Error loading testimonials. Please try again later."
        className="bg-background-dark-200 w-[360px] flex-grow rounded-2xl"
      />
    );

  if (!displayTestimonials?.length)
    return (
      <EmptyData
        content="No testimonials found!"
        className="bg-background-dark-200 w-[360px] flex-grow rounded-2xl"
      />
    );

  return (
    <div
      className="bg-background-dark-200 shadow-smoke mx-auto flex w-full flex-grow flex-col rounded-2xl border border-neutral-100 p-5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex-grow rounded-lg">
        <div className="absolute inset-0 -bottom-1 z-[0] bg-linear-(--testimonial-gradient)" />
        <div className="absolute inset-0 z-[1] bg-radial-(--testimonial-radial)" />
        <div className="absolute inset-x-4 top-4 z-[2] flex justify-end gap-3">
          <ArrowIcon
            onClick={handleManualPrev}
            className="cursor-pointer transition-opacity hover:opacity-80"
          />
          <ArrowIcon
            onClick={handleManualNext}
            className="rotate-180 cursor-pointer transition-opacity hover:opacity-80"
          />
        </div>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          src={currentTestimonial?.image}
          alt={currentTestimonial?.name}
          className="h-[300px] w-full rounded-xl object-cover transition-opacity duration-500 select-none"
        />
        <div className="absolute inset-x-0 bottom-0 left-4 z-[3] mb-3 select-none">
          <h3 className="font-dm-sans text-shadow-testimonial-content text-2xl/[33px] font-bold tracking-[-0.96px] text-white">
            {currentTestimonial?.name}
          </h3>
          <p className="font-dm-sans text-background-400 text-shadow-testimonial-content text-sm tracking-[-0.28px]">
            {currentTestimonial?.address}
          </p>
        </div>
      </div>
      <div className="relative mt-1">
        <p className="font-dm-sans z-10 mb-4 line-clamp-6 text-2xl/[33px] font-medium tracking-[-0.96px] text-white">
          {currentTestimonial?.description}
        </p>
        <QuotesIcon className="absolute top-0 right-0 z-0" />
      </div>
    </div>
  );
};

export default Testimonial;
