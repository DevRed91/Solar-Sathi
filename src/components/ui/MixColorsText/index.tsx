import { MixColorsTextProps, TextItem } from '@/types';

const MixColorsText = ({
  content,
  className = '',
  contentClassName = '',
}: MixColorsTextProps) => {
  const color = (value: TextItem['variant'] | TextItem['color']) => {
    switch (value) {
      case 'blue':
        return 'text-secondary-500';
      case 'neutral-300':
        return 'text-background-400';
      case 'neutral-500':
        return 'text-neutral-dark-500';
      default:
        return value ?? 'text-white';
    }
  };

  return (
    <h1 className={`font-poppins flex flex-wrap ${className}`}>
      {content.map((item, index) => {
        return (
          <span
            key={index}
            className={`font-poppins text-[54px]/[76px] font-bold -tracking-[1.08px] ${item.break ? 'w-full' : ''} ${color(item.variant || item.color)} ${contentClassName}`}
          >
            {item.text}&nbsp;
          </span>
        );
      })}
    </h1>
  );
};

export default MixColorsText;
