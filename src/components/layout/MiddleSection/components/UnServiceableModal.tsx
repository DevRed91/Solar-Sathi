import Image from 'next/image';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import BackToHome from './BackToHome';
import { ServiceModalProps } from '@/types';

const UnServiceableModal = ({
  open,
  onClose,
  handlePinClick,
}: ServiceModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-background-dark-400 font-dm-sans flex w-[1413px] flex-col items-center gap-11 pt-14 pb-28">
        <div className="flex flex-col items-center">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            alt="unserviceable"
            className="h-[302px] w-[377px]"
            src="/images/pin.webp"
          />
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-poppins text-[60px]/[84px] font-bold -tracking-[1.2px] text-white">
              {`Sorry, we're not in your area yet`}
            </h2>
            <div className="text-neutral-dark-500 flex flex-col text-[32px]/[44px] font-medium tracking-[-1.28px]">
              <p>{`We currently don't service this PIN code.`}</p>
              <p>{`But we're growing fast and
            might reach your location soon.`}</p>
            </div>
            <p className="text-background-200 text-[32px]/[44px] font-medium -tracking-[1.28px]">
              Get in touch with our team to know more.
            </p>
          </div>
        </div>
        <div className="flex justify-between gap-6">
          <BackToHome className="bg-background-dark-300 border-background-dark-100 min-w-80 rounded-xl border p-8 text-center text-[28px] leading-[39px] -tracking-[1.12px] !no-underline" />
          <Button
            content="Enter Another PIN Code"
            className="w-min px-[70px] py-8 leading-[39px] -tracking-[1.12px]"
            onClick={() => {
              handlePinClick();
              onClose();
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UnServiceableModal;
