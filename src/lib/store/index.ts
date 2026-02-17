import { INITIAL_MAP_STORE_DATA } from '@/data/constants';
import { IdleStateType, MapDataStateType } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSolarState = create<MapDataStateType>()(
  persist(
    (set) => ({
      ...INITIAL_MAP_STORE_DATA,
      setIsHomePage: (data) => set({ isHomePage: data }),
      setMapData: (data) => set({ mapData: data }),
      setPincodeData: (data) => set({ pincodeData: data }),
      setModalState: (updater) =>
        set((state) => ({ modalState: updater(state.modalState) })),
      reset: () => set(INITIAL_MAP_STORE_DATA),
    }),
    {
      name: 'map-store',
      partialize: (state) => ({
        isHomePage: state.isHomePage,
        mapData: state.mapData,
        pincodeData: state.pincodeData,
        modalState: state.modalState,
      }),
    }
  )
);

export const useMapStateAndCityState = create<{
  backTos: { country: boolean; state: boolean };
  setBackToCountry: () => void;
  setBackToState: () => void;
  reset: () => void;
}>((set) => ({
  backTos: { country: false, state: false },
  setBackToCountry: () => set({ backTos: { country: true, state: false } }),
  setBackToState: () => set({ backTos: { country: false, state: true } }),
  reset: () => set({ backTos: { country: false, state: false } }),
}));

export const useIdleFlagStore = create<IdleStateType>((set) => ({
  idleFlag: false,
  setIdleFlag: (idleFlag) => set({ idleFlag }),
}));
