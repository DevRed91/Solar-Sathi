import { MapDataType, PincodeDataType } from '@/types';

// map section

export const getCityLatlng = (
  cityName: string,
  pincodeData: PincodeDataType[]
): [number, number] => {
  let latitude = -1;
  let longitude = -1;
  pincodeData.some((data) => {
    if (data.city.toLowerCase().includes(cityName.toLowerCase())) {
      [longitude, latitude] = data.coordinates;
      return true;
    }
  });
  return [latitude, longitude];
};

export const getCitiesByState = (
  stateName: string,
  mapData: MapDataType,
  pincodeData: PincodeDataType[]
): { cityName: string; count: number; latLng: [number, number] }[] | null => {
  const state = mapData[stateName];

  if (!state) {
    console.error(`State "${stateName}" not found.`);
    return null;
  }

  return Object.keys(state.cities).map((cityName) => ({
    cityName,
    count: state.cities[cityName].count,
    latLng: getCityLatlng(cityName, pincodeData),
  }));
};

export const getPincodesByCity = (
  stateName: string,
  cityName: string,
  mapData: MapDataType
): string[] | null => {
  const state = mapData[stateName];

  if (!state) {
    console.error(`State "${stateName}" not found.`);
    return null;
  }

  const city = state.cities[cityName];

  if (!city) {
    console.error(`City "${cityName}" not found in state "${stateName}".`);
    return null;
  }

  return city.active_pincode;
};

export const getCoordinatesByPincode = (
  pincode: number,
  pincodeData: PincodeDataType[]
): [number, number] | undefined => {
  let longitude: number = -1,
    latitude: number = -1;
  pincodeData.some((data) => {
    if (data.pincode === pincode) {
      [longitude, latitude] = data.coordinates;
      return true;
    }
  });

  return [latitude, longitude];
};

export const formatNumWithUnits = ({
  num,
  isRupees = false,
}: {
  num: number;
  isRupees?: boolean;
}) => {
  if (num >= 10000000) {
    // 1 crore and above
    return [
      {
        text: `${isRupees ? '₹' : ''}${(num / 10000000).toFixed(2).replace(/\.00$/, '')}`,
      },
      { text: 'Cr', highlighted: true },
    ];
  } else if (num >= 100000) {
    // between 1 lakh and 1 crore
    return [
      {
        text: `${isRupees ? '₹' : ''}${(num / 100000).toFixed(2).replace(/\.00$/, '')}`,
      },
      { text: 'L', highlighted: true },
    ];
  } else if (num >= 10000) {
    // between 10k and 1 lakh
    return [
      {
        text: `${isRupees ? '₹' : ''}${(num / 1000).toFixed(2).replace(/\.00$/, '')}`,
      },
      { text: 'K', highlighted: true },
    ];
  } else {
    // Less than 10k
    return [{ text: `${isRupees ? '₹' : ''}${num.toLocaleString()}` }];
  }
};

export const toTitleCase = (input: string) => {
  return input
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const shuffleArray = <T>(arr: T[]): T[] =>
  [...arr]
    .map((_, i, a) => [Math.random(), a[i]] as [number, T]) // pair each item with a random number -> [[0.73, T], [0.12, T], ...]
    .sort(([x], [y]) => x - y) // sort by those random numbers
    .map(([, v]) => v); // drop those numbers
