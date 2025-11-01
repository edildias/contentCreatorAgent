import type { Post, PostStatus } from '@/types/post';
import { KanbanPostCard } from './kanban-post-card';

interface Column {
  status: PostStatus;
  title: string;
  description: string;
  posts: Post[];
}

interface Props {
  column: Column;
  onStatusChange: (postId: string, status: PostStatus) => void;
  onEdit: (post: Post) => void;
}

export function KanbanColumn({ column, onStatusChange, onEdit }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div>
        <h3 className="text-lg font-semibold text-white">{column.title}</h3>
        <p className="text-sm text-slate-400">{column.description}</p>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {column.posts.length === 0 ? (
          <p className="text-sm text-slate-500">No posts yet.</p>
        ) : (
          column.posts.map((post) => (
            <KanbanPostCard key={post.id} post={post} onStatusChange={onStatusChange} onEdit={onEdit} />
          ))
        )}
      </div>
    </div>
  );
}
