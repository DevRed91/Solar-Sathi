import { WestIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import MixColorsText from '@/components/ui/MixColorsText';
import Modal from '@/components/ui/Modal';
import Numpad from '@/components/ui/Numpad';
import { PIN_INPUT_LIMIT } from '@/data/constants';
import { PinCodeModalProps } from '@/types';
import { useEffect, useState } from 'react';

const PinCodeModal = ({
  open,
  onClose,
  handleSubmit,
  isLoading,
}: PinCodeModalProps) => {
  const [pinCode, setPinCode] = useState<string>('');
  const [errorText, setErrorText] = useState('');

  const onSubmit = () => {
    if (isLoading) return;
    handleSubmit(pinCode);
  };

  useEffect(() => {
    if (!open) setPinCode('');
  }, [open]);

  const isDisabled = errorText || pinCode.length !== PIN_INPUT_LIMIT;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-background-dark-400 font-dm-sans flex h-[770px] max-w-4xl flex-col items-center justify-between gap-8 p-12">
        <MixColorsText
          content={[
            { text: 'Find out how many homes near you', break: true },
            { text: 'are' },
            { text: 'SolarSquare', variant: 'blue' },
            { text: 'homes' },
          ]}
          className="!font-dm-sans justify-center text-center"
          contentClassName="!font-dm-sans !text-[40px] !leading-14 !font-semibold"
        />
        <div className="flex w-3/5 flex-grow flex-col justify-between gap-8">
          <Numpad
            onChange={(value) => {
              if (value.startsWith('0')) {
                setErrorText('Pin code cannot start with 0');
              } else {
                setErrorText('');
                setPinCode(value);
              }
            }}
            inputLimit={PIN_INPUT_LIMIT}
            defaultInput={pinCode}
            errorText={errorText}
          />
          <div className="flex w-full justify-between gap-6">
            <Button
              variant="tertiary"
              content="Back"
              leftIcon={<WestIcon />}
              onClick={onClose}
              className="w-min"
            />
            <Button
              variant={isDisabled ? 'disable' : 'primary'}
              content="Submit"
              onClick={onSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PinCodeModal;
