export function LeadsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Lead Inbox</h1>
      <p className="text-sm text-slate-400">
        Lead management will connect to your CRM or manual uploads. This placeholder keeps the navigation consistent while the
        integration is finalized.
      </p>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
        No leads yet. Configure your integrations to see inbound opportunities.
      </div>
    </div>
  );
}
