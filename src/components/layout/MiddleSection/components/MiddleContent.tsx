import Button from '@/components/ui/Button';
import MixColorsText from '@/components/ui/MixColorsText';
import { MiddleContentProps } from '@/types';

const MiddleContent = ({
  top: { titleProps, subtitleProps },
  bottom: { textProps, buttonProps },
}: MiddleContentProps) => {
  return (
    <div className="pointer-events-none flex h-full flex-col items-center justify-between text-white">
      <div className="flex flex-col items-center gap-2">
        <MixColorsText {...titleProps} />
        <MixColorsText
          {...subtitleProps}
          contentClassName={`!font-dm-sans !text-[32px] !leading-[45px] !font-normal !-tracking-[1.28px] [&:last-child]:!font-medium ${subtitleProps?.contentClassName ?? ''}`}
        />
      </div>
      <div className="bg-background-dark-300 flex w-3xl gap-6 rounded-xl border border-neutral-100 px-6 py-4">
        <MixColorsText
          {...textProps}
          className={`w-3/5 ${textProps?.className ?? ''}`}
          contentClassName={`!font-dm-sans !text-2xl !font-normal [&:nth-last-child(2)]:!font-bold ${textProps?.contentClassName ?? ''}`}
        />
        <Button
          {...buttonProps}
          className={`animate-btn pointer-events-auto !h-fit !max-w-[282px] ${buttonProps?.className ?? ''}`}
        />
      </div>
    </div>
  );
};

export default MiddleContent;
