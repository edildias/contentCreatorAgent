import { FormEvent, useState } from 'react';

import { useCreateTheme, useDeleteTheme, useThemes } from '@/services/themes';

const INITIAL_FORM = { title: '', description: '', objective: '', format: '' };

export function ThemesPage() {
  const { data: themes } = useThemes();
  const createTheme = useCreateTheme();
  const deleteTheme = useDeleteTheme();
  const [form, setForm] = useState(INITIAL_FORM);

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.description) return;
    createTheme.mutate(form, {
      onSuccess: () => setForm(INITIAL_FORM)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Themes</h1>
        <p className="text-sm text-slate-400">Define the pillars that guide your content generation.</p>
      </div>

      <form onSubmit={handleCreate} className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2">
        <input
          placeholder="Theme title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          required
        />
        <input
          placeholder="Content format"
          value={form.format}
          onChange={(event) => setForm((prev) => ({ ...prev, format: event.target.value }))}
          className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          required
        />
        <input
          placeholder="Objective"
          value={form.objective}
          onChange={(event) => setForm((prev) => ({ ...prev, objective: event.target.value }))}
          className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          required
        />
        <button type="submit" className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80">
          Add theme
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {themes?.map((theme) => (
          <div key={theme.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{theme.title}</h3>
                <p className="text-sm text-slate-400">{theme.objective}</p>
              </div>
              <button
                onClick={() => deleteTheme.mutate(theme.id)}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Remove
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-300">{theme.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs uppercase text-slate-500">
              <span>Format: {theme.format}</span>
              <span>Posts: {theme.posts.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
