import type { Post } from './post';

export interface ThemePerformance {
  id: string;
  title: string;
  description: string;
  objective: string;
  format: string;
  posts: Post[];
  postsCount?: number;
  leads?: number;
  engagement?: number;
  impressions?: number;
}
