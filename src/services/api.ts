import { ExpCenterBodyType } from '@/types';
import axios from 'axios';

const GATEWAY_BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_BASE_URL;
const SOLAR_SATHI_BASE_URL = process.env.NEXT_PUBLIC_SOLAR_SATHI_BASE_URL;
const SOLAR_SATHI_STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_SOLAR_SATHI_STRAPI_API_KEY;

const testimonialAction = axios.create({
  baseURL: GATEWAY_BASE_URL,
  headers: {
    Authorization: `Bearer ${SOLAR_SATHI_STRAPI_BASE_URL}`,
  },
});

const expCenterAction = axios.create({
  baseURL: SOLAR_SATHI_BASE_URL,
  headers: {
    'x-auth-token': process.env.NEXT_PUBLIC_SOLAR_SATHI_API_KEY,
  },
});

// testimonial-service

export const getTestimonials = async () => {
  const response = await testimonialAction.get(
    '/api/solar-sathi-testimonials?populate=*'
  );
  return response.data;
};

// map-service

export const getMapData = async () => {
  const response = await axios.get(
    'https://script.googleusercontent.com/macros/echo',
    {
      params: {
        user_content_key: process.env.NEXT_PUBLIC_MAP_USER_CONTENT_KEY,
        lib: process.env.NEXT_PUBLIC_MAP_LIB_KEY,
      },
    }
  );
  return response.data;
};

export const getGeoJSONData = async (fileName: string | null) => {
  const response = await axios.get(`/mapData/geoJson/${fileName}.geojson`);
  return response.data;
};

export const getPinCodeData = async () => {
  const response = await axios.get('/mapData/json/Pincode.json');
  return response.data;
};

// exp-center-service

export const getExpCenter = async (body: ExpCenterBodyType) => {
  const response = await expCenterAction.post(
    '/consumer/dashboard/experience-centre',
    body
  );
  return response.data.data;
};
