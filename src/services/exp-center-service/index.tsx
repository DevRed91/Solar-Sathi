import { useMutation } from '@tanstack/react-query';
import { getExpCenter } from '../api';
import useQueryParams from '@/hooks/useQueryParams';
import { ExpCenterBodyType } from '@/types';

export const useGetExpCenter = () => {
  const { queryParams } = useQueryParams();

  return useMutation({
    mutationKey: ['get_exp_center'],

    mutationFn: (body?: ExpCenterBodyType) =>
      getExpCenter(
        body
          ? body
          : queryParams.pincode
            ? { pincode: queryParams.pincode }
            : Object.keys(queryParams).length
              ? queryParams
              : {}
      ),
  });
};
