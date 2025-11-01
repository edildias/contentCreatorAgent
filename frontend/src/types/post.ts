export type PostStatus = 'BACKLOG' | 'TO_REVIEW' | 'READY_TO_PUBLISH' | 'PUBLISHED';

export interface PostMetrics {
  impressions: number;
  engagement: number;
  leads: number;
}

export interface Post {
  id: string;
  themeId: string;
  idea: string;
  title: string;
  text: string;
  imageUrl?: string | null;
  status: PostStatus;
  scheduledAt?: string | null;
  publishNow?: boolean;
  createdAt: string;
  updatedAt: string;
  metrics?: PostMetrics | null;
  theme?: {
    id: string;
    title: string;
  };
}
