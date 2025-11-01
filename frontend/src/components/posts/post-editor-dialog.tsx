import { FormEvent, useEffect, useState } from 'react';

import type { Post, PostStatus } from '@/types/post';
import type { ThemePerformance } from '@/types/theme';

interface Props {
  open: boolean;
  post: Post | null;
  themes: ThemePerformance[];
  onClose: () => void;
  onSave: (postId: string, data: Partial<Post>) => void;
}

export function PostEditorDialog({ open, post, themes, onClose, onSave }: Props) {
  const [form, setForm] = useState<Partial<Post>>({});

  useEffect(() => {
    if (post) {
      setForm({
        themeId: post.themeId,
        title: post.title,
        idea: post.idea,
        text: post.text,
        status: post.status,
        scheduledAt: post.scheduledAt ?? undefined,
        publishNow: post.publishNow ?? undefined,
        imageUrl: post.imageUrl ?? undefined
      });
    }
  }, [post]);

  if (!open || !post) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!post) return;
    onSave(post.id, form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-white">Edit Post</h2>
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-200">
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              Theme
              <select
                value={form.themeId ?? post.themeId}
                onChange={(event) => setForm((prev) => ({ ...prev, themeId: event.target.value }))}
                className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
              >
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Status
              <select
                value={form.status ?? post.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as PostStatus }))}
                className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
              >
                <option value="BACKLOG">Backlog</option>
                <option value="TO_REVIEW">To Review</option>
                <option value="READY_TO_PUBLISH">Ready to Publish</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </label>
          </div>
          <label className="space-y-2 text-sm text-slate-300">
            Title
            <input
              value={form.title ?? post.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Idea
            <input
              value={form.idea ?? post.idea}
              onChange={(event) => setForm((prev) => ({ ...prev, idea: event.target.value }))}
              className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Text
            <textarea
              value={form.text ?? post.text}
              onChange={(event) => setForm((prev) => ({ ...prev, text: event.target.value }))}
              className="h-40 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Scheduled Date
            <input
              type="datetime-local"
              value={form.scheduledAt ? form.scheduledAt.slice(0, 16) : ''}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  scheduledAt: event.target.value ? event.target.value : undefined
                }))
              }
              className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
            />
          </label>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.publishNow ?? post.publishNow ?? false}
                onChange={(event) => setForm((prev) => ({ ...prev, publishNow: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800"
              />
              Publish immediately when ready
            </label>
            <button type="submit" className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
