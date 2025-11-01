import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type DataPoint = {
  date: string;
  leads: number;
  engagement: number;
  impressions: number;
};

interface Props {
  data: DataPoint[];
}

export function PerformanceChart({ data }: Props) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-lg font-semibold text-white">Performance Trend</h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
            <Line type="monotone" dataKey="leads" stroke="#5B21B6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="engagement" stroke="#0EA5E9" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="impressions" stroke="#F97316" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
