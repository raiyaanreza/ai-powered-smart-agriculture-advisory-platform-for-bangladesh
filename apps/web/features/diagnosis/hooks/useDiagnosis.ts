import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useDiagnosisStats = () => {
  return useQuery({
    queryKey: ['diagnosis-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/stats');
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30s
  });
};

export const useDiagnoseImage = () => {
  return useMutation({
    mutationFn: async ({ image, userId }: { image: string, userId?: string }) => {
      const response = await axios.post('/api/diagnose', {
        image,
        language: 'bn',
        userId,
      });
      return response.data;
    },
  });
};
