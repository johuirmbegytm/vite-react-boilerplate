import api from '../../lib/axios';
import type { Position } from './types';

export const fetchPositions = async (): Promise<Position[]> => {
  const response = await api.get('/positions');
  return response.data?.data ?? [];
};

