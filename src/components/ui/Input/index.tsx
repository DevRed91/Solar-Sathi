import { InputProps } from '@/types';

const Input = ({
  className,
  placeholderText,
  disabled,
  readOnly,
  errorText,
  id,
  ...props
}: InputProps) => {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          id={id}
          placeholder={placeholderText}
          disabled={disabled}
          readOnly={readOnly}
          className={`peer bg-background-dark-100 font-dm-sans block w-full appearance-none rounded-xl border-0 px-7.5 py-5 text-[32px] font-semibold text-white focus:border-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
            errorText
              ? 'border-2 border-red-800 focus:border-red-800'
              : 'border-2 border-neutral-100'
          } ${className}`}
          {...props}
        />
      </div>
      {errorText && (
        <p className="font-dm-sans mt-2 w-full text-left text-2xl leading-none font-medium text-red-800">
          {errorText}
        </p>
      )}
    </div>
  );
};

export default Input;
