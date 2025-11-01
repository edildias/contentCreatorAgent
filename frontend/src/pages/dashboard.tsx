import { addDays, format, subDays } from 'date-fns';
import { useMemo, useState } from 'react';

import { KpiCard } from '@/components/dashboard/kpi-card';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { useDashboardSummary } from '@/services/metrics';

export function DashboardPage() {
  const [range, setRange] = useState({ start: subDays(new Date(), 14), end: new Date() });
  const { data, isLoading } = useDashboardSummary(range);

  const chartData = useMemo(() => {
    if (!data) return [];
    const days = [];
    let cursor = range.start;
    while (cursor <= range.end) {
      const dayString = format(cursor, 'MMM d');
      const dayMetrics = data.themes.reduce(
        (acc, theme) => {
          const themePost = theme.posts.find((post) => format(new Date(post.createdAt), 'MMM d') === dayString);
          if (themePost?.metrics) {
            acc.leads += themePost.metrics.leads ?? 0;
            acc.engagement += themePost.metrics.engagement ?? 0;
            acc.impressions += themePost.metrics.impressions ?? 0;
          }
          return acc;
        },
        { leads: 0, engagement: 0, impressions: 0 }
      );
      days.push({ date: dayString, ...dayMetrics });
      cursor = addDays(cursor, 1);
    }
    return days;
  }, [data, range.end, range.start]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Growth dashboard</h1>
          <p className="text-sm text-slate-400">Track how your LinkedIn machine is performing.</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <label className="space-y-1">
            <span className="text-xs uppercase text-slate-500">Start</span>
            <input
              type="date"
              value={format(range.start, 'yyyy-MM-dd')}
              onChange={(event) => setRange((prev) => ({ ...prev, start: new Date(event.target.value) }))}
              className="rounded border border-slate-700 bg-slate-900 px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs uppercase text-slate-500">End</span>
            <input
              type="date"
              value={format(range.end, 'yyyy-MM-dd')}
              onChange={(event) => setRange((prev) => ({ ...prev, end: new Date(event.target.value) }))}
              className="rounded border border-slate-700 bg-slate-900 px-3 py-2"
            />
          </label>
        </div>
      </div>

      {isLoading || !data ? (
        <p className="text-sm text-slate-400">Loading metrics…</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Leads" value={data.totals.leads} helperText="Total captured in range" />
            <KpiCard label="Impressions" value={data.totals.impressions} />
            <KpiCard label="Engagement" value={data.totals.engagement} />
            <KpiCard label="Posts published" value={data.totals.posts} />
          </div>

          <PerformanceChart data={chartData} />

          <div className="grid gap-4 md:grid-cols-2">
            {data.themes.map((theme) => (
              <div key={theme.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{theme.title}</h3>
                    <p className="text-sm text-slate-400">{theme.objective}</p>
                  </div>
                  <span className="text-xs uppercase text-slate-500">{theme.format}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <span>Posts: {theme.postsCount ?? theme.posts.length}</span>
                  <span>Leads: {theme.leads ?? 0}</span>
                  <span>Engagement: {theme.engagement ?? 0}</span>
                  <span>Impressions: {theme.impressions ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
