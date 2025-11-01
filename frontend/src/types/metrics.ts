import type { ThemePerformance } from './theme';

export interface DashboardTotals {
  posts: number;
  leads: number;
  engagement: number;
  impressions: number;
}

export interface DashboardSummary {
  totals: DashboardTotals;
  themes: ThemePerformance[];
}
