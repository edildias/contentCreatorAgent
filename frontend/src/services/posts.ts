import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Post, PostStatus } from '@/types/post';

import { api } from './api';

type PostInput = Pick<Post, 'themeId' | 'idea' | 'title' | 'text'> & {
  imageUrl?: string | null;
  status?: PostStatus;
  scheduledAt?: string | null;
  publishNow?: boolean;
};

export function usePosts(filters?: { themeId?: string; status?: PostStatus }) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      const { data } = await api.get<Post[]>('/posts', { params: filters });
      return data;
    }
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PostInput) => {
      const { data } = await api.post<Post>('/posts', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, ...input }: { postId: string } & Partial<PostInput>) => {
      const { data } = await api.patch<Post>(`/posts/${postId}`, input);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      if ('status' in variables && variables.status) {
        queryClient.invalidateQueries({ queryKey: ['metrics', 'summary'] });
      }
    }
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      await api.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
}
