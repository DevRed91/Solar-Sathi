import { RupeeIcon, SolarHomeIcon, SubsidyIcon } from '@/components/icons';
import {
  MetricsCardProps,
  MiddleSectionModalStateProps,
  StateDataType,
} from '@/types';

export const INITIAL_METRICS_DATA: MetricsCardProps[] = [
  {
    title: 'Solarsquare Homes',
    icon: SolarHomeIcon,
  },
  {
    title: 'Annual Savings Generated',
    icon: RupeeIcon,
  },

  {
    title: 'Govt. Subsidy Disbursed',
    icon: SubsidyIcon,
  },
];

export const PIN_INPUT_LIMIT = 6;

// map section

export const MAP_STYLE_DATA = {
  fillColor: '#151930',
  weight: 1,
  opacity: 1,
  color: '#3f4774',
  fillOpacity: 1,
  className: 'state',

  // Highlight/focused states styling
  focusWeight: 2,
  focusColor: '#49549d',
  focusFillColor: '#1b1f3f',
  focusFillOpacity: 0.5,
};

export const INITIAL_MAP_STORE_DATA = {
  isHomePage: true,
  mapData: {},
  pincodeData: [],
  modalState: {
    pinCode: false,
    serviceable: false,
    unserviceable: false,
  } as MiddleSectionModalStateProps,
};

export const STATE_NAME_DATA = [
  'Delhi',
  'Rajasthan',
  'Uttar Pradesh',
  'Gujarat',
  'Madhya Pradesh',
  'Maharashtra',
  'Telangana',
  'Karnataka',
  'Tamil Nadu',
] as const;

export const STATE_DATA: StateDataType = {
  'Andhra pradesh': {
    latLng: [15.9129, 79.74],
  },
  'Arunachal pradesh': {
    latLng: [27.0928, 93.6053],
  },
  Assam: {
    latLng: [26.2006, 92.9376],
  },
  Bihar: {
    latLng: [25.0961, 85.3131],
  },
  Chhattisgarh: {
    latLng: [21.2787, 81.8661],
  },
  Goa: {
    latLng: [15.2993, 74.124],
  },
  Gujarat: {
    latLng: [22.7367, 71.5136],
  },
  Haryana: {
    latLng: [29.0588, 76.0856],
  },
  'Himachal pradesh': {
    latLng: [32.0591, 77.1734],
  },
  Jharkhand: {
    latLng: [23.6102, 85.2799],
  },
  Karnataka: {
    latLng: [15.3294, 75.7211],
  },
  Kerala: {
    latLng: [10.8505, 76.2711],
  },
  'Madhya pradesh': {
    latLng: [23.0435, 77.6211],
  },
  Maharashtra: {
    latLng: [19.4006, 75.5722],
  },
  Manipur: {
    latLng: [24.6637, 93.9063],
  },
  Meghalaya: {
    latLng: [25.467, 91.3662],
  },
  Mizoram: {
    latLng: [23.1645, 92.9376],
  },
  Nagaland: {
    latLng: [26.1584, 94.5624],
  },
  Odisha: {
    latLng: [20.9517, 85.0985],
  },
  Punjab: {
    latLng: [31.1471, 75.3412],
  },
  Rajasthan: {
    latLng: [26.1453, 73.9623],
  },
  Sikkim: {
    latLng: [27.533, 88.614],
  },
  'Tamil nadu': {
    latLng: [11.08, 78.2017],
  },
  Telangana: {
    latLng: [18.2266, 79.2932],
  },
  Tripura: {
    latLng: [23.9408, 91.9882],
  },
  'Uttar pradesh': {
    latLng: [26.9196, 80.5831],
  },
  Uttarakhand: {
    latLng: [30.0668, 79.0193],
  },
  'West bengal': {
    latLng: [22.9868, 87.855],
  },
  Chandigarh: {
    latLng: [30.7333, 76.7794],
  },
  Lakshadweep: {
    latLng: [10.568, 72.96],
  },
  Delhi: {
    latLng: [28.6964, 77.0356],
  },
  Puducherry: {
    latLng: [11.9416, 79.8083],
  },
};

export const DEFAULT_BREADCRUMBS = [
  {
    key: 'home',
    label: 'Home',
    onClick: null, // assigned in component to access current closures
  },
];

export const RIBBON_DATA = [
  'A new home goes solar with SolarSquare every 25 minutes',
  'Every 25 minutes, a new family goes solar with SolarSquare',
  "SolarSquare - India's #1 Home Solar Company",
  '30000+ homes across India powered by SolarSquare',
  'Real Impact:  2 Lakh Tons CO₂ emissions reduced',
  'Brightening homes in 20+Cities across 9 states',
];

export const STATE_SHORT_FORMS: Record<
  (typeof STATE_NAME_DATA)[number],
  string
> = {
  Delhi: 'DL',
  Rajasthan: 'RJ',
  'Uttar Pradesh': 'UP',
  Gujarat: 'GJ',
  'Madhya Pradesh': 'MP',
  Maharashtra: 'MH',
  Telangana: 'TS',
  Karnataka: 'KA',
  'Tamil Nadu': 'TN',
};
