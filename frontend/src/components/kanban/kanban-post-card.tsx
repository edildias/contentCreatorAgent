import { format } from 'date-fns';

import type { Post, PostStatus } from '@/types/post';

const STATUS_OPTIONS: { label: string; value: PostStatus }[] = [
  { value: 'BACKLOG', label: 'Backlog' },
  { value: 'TO_REVIEW', label: 'To Review' },
  { value: 'READY_TO_PUBLISH', label: 'Ready to Publish' },
  { value: 'PUBLISHED', label: 'Published' }
];

interface Props {
  post: Post;
  onStatusChange: (postId: string, status: PostStatus) => void;
  onEdit: (post: Post) => void;
}

export function KanbanPostCard({ post, onStatusChange, onEdit }: Props) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/80 p-3 shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-white">{post.title}</h4>
          <p className="text-xs uppercase tracking-wide text-primary">{post.theme?.title ?? 'Unassigned'}</p>
        </div>
        <button className="text-xs text-secondary hover:text-secondary/80" onClick={() => onEdit(post)}>
          Edit
        </button>
      </div>
      <p className="text-sm text-slate-300">{post.text}</p>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Updated {format(new Date(post.updatedAt), 'MMM d')}</span>
        {post.scheduledAt ? <span>Scheduled {format(new Date(post.scheduledAt), 'MMM d, HH:mm')}</span> : null}
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
        <label className="text-slate-400" htmlFor={`status-${post.id}`}>
          Status
        </label>
        <select
          id={`status-${post.id}`}
          value={post.status}
          onChange={(event) => onStatusChange(post.id, event.target.value as PostStatus)}
          className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}
