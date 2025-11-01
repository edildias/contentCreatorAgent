import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ThemePerformance } from '@/types/theme';

import { api } from './api';

type ThemeInput = Pick<ThemePerformance, 'title' | 'description' | 'objective' | 'format'>;

export function useThemes() {
  return useQuery({
    queryKey: ['themes'],
    queryFn: async () => {
      const { data } = await api.get<ThemePerformance[]>('/themes');
      return data;
    }
  });
}

export function useCreateTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ThemeInput) => {
      const { data } = await api.post('/themes', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    }
  });
}

export function useUpdateTheme(themeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<ThemeInput>) => {
      const { data } = await api.patch(`/themes/${themeId}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    }
  });
}

export function useDeleteTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (themeId: string) => {
      await api.delete(`/themes/${themeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    }
  });
}
