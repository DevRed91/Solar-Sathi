'use client';

import React, { useEffect, useState } from 'react';
import Input from '../Input';
import { BackSpaceIcon } from '@/components/icons';
import { NumpadProps } from '@/types';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

const Numpad = ({
  onChange,
  errorText,
  inputLimit = 4,
  defaultInput = '',
  inputPlaceholderText = 'Enter PIN Code',
}: NumpadProps) => {
  const [input, setInput] = useState(defaultInput);

  useEffect(() => {
    setInput(defaultInput);
  }, [defaultInput]);

  const updateInput = (newValue: string) => {
    setInput(newValue);
    onChange?.(newValue);
  };

  const handleButtonClick = (value: string) => {
    if (input.length < inputLimit) {
      updateInput(input + value);
    }
  };

  const handleClear = () => {
    if (input.length > 0) {
      updateInput(input.slice(0, -1));
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-8">
      <Input
        value={input}
        readOnly
        errorText={errorText}
        placeholderText={inputPlaceholderText}
        className="w-full text-center !text-[40px]/14 font-medium"
      />

      <div className="grid h-full w-full grid-cols-3 gap-3">
        {KEYS.map((key) => (
          <button
            disabled={key === '.'}
            key={key}
            onClick={() => handleButtonClick(key)}
            className="flex cursor-pointer items-center justify-center rounded-lg bg-neutral-400 px-16.5 py-[9px] text-[32px] leading-[45px] font-semibold text-white disabled:cursor-not-allowed"
          >
            {key}
          </button>
        ))}

        <button
          onClick={handleClear}
          className="flex cursor-pointer items-center justify-center rounded-lg bg-neutral-400 px-16.5 py-[9px]"
        >
          <BackSpaceIcon className="h-min min-w-9" />
        </button>
      </div>
    </div>
  );
};

export default Numpad;
