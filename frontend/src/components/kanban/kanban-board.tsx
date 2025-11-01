import { useMemo } from 'react';

import type { Post, PostStatus } from '@/types/post';
import { KanbanColumn } from './kanban-column';

const STATUS_COLUMNS: { status: PostStatus; title: string; description: string }[] = [
  { status: 'BACKLOG', title: 'Backlog', description: 'Ideas ready for crafting' },
  { status: 'TO_REVIEW', title: 'To Review', description: 'Posts awaiting your approval' },
  { status: 'READY_TO_PUBLISH', title: 'Ready to Publish', description: 'Approved and scheduled content' },
  { status: 'PUBLISHED', title: 'Published', description: 'Live posts and performance' }
];

interface Props {
  posts: Post[];
  onStatusChange: (postId: string, status: PostStatus) => void;
  onEdit: (post: Post) => void;
}

export function KanbanBoard({ posts, onStatusChange, onEdit }: Props) {
  const columns = useMemo(() => {
    return STATUS_COLUMNS.map((column) => ({
      ...column,
      posts: posts.filter((post) => post.status === column.status)
    }));
  }, [posts]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((column) => (
        <KanbanColumn key={column.status} column={column} onStatusChange={onStatusChange} onEdit={onEdit} />
      ))}
    </div>
  );
}
