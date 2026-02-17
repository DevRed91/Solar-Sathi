'use client';
import React from 'react';
import AnimatingDots from '../AnimatingDots';
import { ButtonProps, ButtonVariant } from '@/types';

const baseStyles =
  'flex items-center justify-center gap-2 px-8 py-4 text-[28px] font-semibold rounded-xl h-full w-full text-white pointer-events-auto';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-linear-(--button-primary-gradient) cursor-pointer',
  secondary:
    'bg-background-dark-300 border border-background-dark-100 cursor-pointer',
  tertiary: 'bg-transparent border border-neutral-dark-500 cursor-pointer',
  disable:
    'bg-linear-(--button-primary-gradient) opacity-50 cursor-not-allowed',
};

const dotColors: Record<ButtonVariant, string> = {
  primary: 'bg-brand-200',
  secondary: 'bg-brand',
  tertiary: 'bg-black-300',
  disable: 'bg-brand-200',
};

const Button = ({
  variant = 'primary',
  content,
  className = '',
  leftIcon,
  rightIcon,
  onClick,
  isLoading = false,
}: ButtonProps) => {
  const isDisabled = isLoading || variant === 'disable';
  const classes = [baseStyles, variantStyles[variant], className].join(' ');

  return (
    <button className={classes} disabled={isDisabled} onClick={onClick}>
      {isLoading ? (
        <AnimatingDots color={dotColors[variant]} />
      ) : (
        <div className="inline-flex items-center gap-[18px]">
          {leftIcon && <span>{leftIcon}</span>}
          <span className="whitespace-nowrap">{content}</span>
          {rightIcon && <span>{rightIcon}</span>}
        </div>
      )}
    </button>
  );
};

export default Button;
