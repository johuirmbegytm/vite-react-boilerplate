import { useQuery } from '@tanstack/react-query';
import { fetchPositions } from './api';

export const usePositions = () => {
  return useQuery({
    queryKey: ['positions'],
    queryFn: fetchPositions,
    staleTime: 1000 * 60 * 5,  // 5 хвилин кеш
  });
};