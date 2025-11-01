import { subDays } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { DashboardSummary } from '@/types/metrics';

import { api } from './api';

export function useDashboardSummary(range?: { start: Date; end: Date }) {
  const params = range
    ? { start: range.start.toISOString(), end: range.end.toISOString() }
    : { start: subDays(new Date(), 30).toISOString(), end: new Date().toISOString() };

  return useQuery({
    queryKey: ['metrics', 'summary', params],
    queryFn: async () => {
      const { data } = await api.get<DashboardSummary>('/metrics/summary', { params });
      return data;
    }
  });
}

export function useUpdatePostMetrics() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      impressions,
      engagement,
      leads
    }: {
      postId: string;
      impressions: number;
      engagement: number;
      leads: number;
    }) => {
      await api.post(`/metrics/posts/${postId}`, { impressions, engagement, leads });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
}
