'use client';
import HomePage from './components/HomePage';
import MiddleContent from './components/MiddleContent';
import PinCodeModal from './components/PinCodeModal';
import ServiceableModal from './components/ServiceableModal';
import UnServiceableModal from './components/UnServiceableModal';
import { useSolarState } from '@/lib/store';
import useQueryParams from '@/hooks/useQueryParams';
import { MiddleSectionModalStateProps } from '@/types';
import { useGetExpCenter } from '@/services/exp-center-service';

const MiddleSection = () => {
  const { isHomePage, modalState, setModalState } = useSolarState();
  const { queryParams } = useQueryParams();
  const getExpCenterQuery = useGetExpCenter();

  const openModal = (type: keyof MiddleSectionModalStateProps) =>
    setModalState((prev) => ({ ...prev, [type]: true }));

  const closeModal = (type: keyof MiddleSectionModalStateProps) =>
    setModalState((prev) => ({ ...prev, [type]: false }));

  const handlePinSubmit = (pinCode: string) => {
    getExpCenterQuery.mutate(
      { pincode: pinCode },
      {
        onSuccess: (data) => {
          const selectedCity = data.data.find(
            (city: { pincode: string }) => city.pincode === pinCode
          );
          if (selectedCity) {
            setModalState((prev) => ({
              ...prev,
              serviceable: {
                pinCode,
                city: data.city,
                count: selectedCity.count,
                lifetimeSavings: selectedCity.lifetimeSavings,
              },
            }));
          } else {
            openModal('unserviceable');
          }
        },
        onError: () => openModal('unserviceable'),
        onSettled: () => closeModal('pinCode'),
      }
    );
  };

  return (
    <div className="relative z-[1] flex-grow">
      {isHomePage ? (
        <HomePage />
      ) : (
        <MiddleContent
          top={{
            titleProps: {
              content: [
                { text: 'SolarSquare Homes in' },
                {
                  text:
                    queryParams.state && queryParams.city
                      ? queryParams.city.length > 14
                        ? queryParams.city.slice(0, 11) + '...'
                        : queryParams.city
                      : queryParams.state
                        ? queryParams.state.length > 14
                          ? queryParams.state.slice(0, 11) + '...'
                          : queryParams.state
                        : 'India',
                  variant: 'blue',
                },
              ],
            },
            subtitleProps: {
              content: [
                {
                  text: 'Tap on a State to see homes powered by',
                  variant: 'neutral-500',
                },
                { text: 'SolarSquare', variant: 'neutral-300' },
              ],
            },
          }}
          bottom={{
            textProps: {
              content: [
                { text: 'Find out how many homes near you', break: true },
                { text: 'are' },
                { text: 'SolarSquare', variant: 'blue' },
                { text: 'homes' },
              ],
            },
            buttonProps: {
              content: 'Enter PIN Code',
              onClick: () => openModal('pinCode'),
            },
          }}
        />
      )}

      {/* Modals */}
      <PinCodeModal
        open={modalState.pinCode}
        onClose={() => closeModal('pinCode')}
        handleSubmit={(pinCode) => handlePinSubmit(pinCode)}
        isLoading={getExpCenterQuery.isPending}
      />
      <ServiceableModal
        open={modalState.serviceable !== false}
        data={modalState.serviceable}
        onClose={() => closeModal('serviceable')}
        handlePinClick={() => openModal('pinCode')}
      />
      <UnServiceableModal
        open={modalState.unserviceable}
        onClose={() => closeModal('unserviceable')}
        handlePinClick={() => openModal('pinCode')}
      />
    </div>
  );
};

export default MiddleSection;
