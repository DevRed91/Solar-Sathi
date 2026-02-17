import { useQuery } from '@tanstack/react-query';
import { getGeoJSONData, getMapData, getPinCodeData } from '../api';

export const useGetMapData = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ['get_map_data'],
    queryFn: getMapData,
    enabled: enabled,
  });
};

export const useGetGeoJSONData = ({
  enabled,
  fileName,
}: {
  enabled: boolean;
  fileName: string | null;
}) => {
  return useQuery({
    queryKey: ['get_geo_json_data', fileName],
    queryFn: async () => {
      if (!fileName) return null;
      return getGeoJSONData(fileName);
    },
    enabled: enabled && !!fileName,
  });
};

export const useGetPincodeData = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ['get_pincode_data'],
    queryFn: getPinCodeData,
    enabled: enabled,
  });
};
