import { useMemo, useState } from 'react';

import { KanbanBoard } from '@/components/kanban/kanban-board';
import { PostEditorDialog } from '@/components/posts/post-editor-dialog';
import { usePosts, useUpdatePost } from '@/services/posts';
import { useThemes } from '@/services/themes';
import type { Post, PostStatus } from '@/types/post';

export function KanbanPage() {
  const { data: posts, isLoading } = usePosts();
  const { data: themes } = useThemes();
  const updatePost = useUpdatePost();
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const postsByStatus = useMemo(() => posts ?? [], [posts]);

  const handleStatusChange = (postId: string, status: PostStatus) => {
    updatePost.mutate({ postId, status });
  };

  const handleEdit = (post: Post) => {
    setActivePost(post);
    setEditorOpen(true);
  };

  const handleSave = (postId: string, data: Partial<Post>) => {
    updatePost.mutate({ postId, ...data }, {
      onSuccess: () => {
        setEditorOpen(false);
        setActivePost(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Content pipeline</h1>
          <p className="text-sm text-slate-400">Move posts through review, approvals and publishing.</p>
        </div>
      </div>

      {isLoading || !postsByStatus ? (
        <p className="text-sm text-slate-400">Loading posts…</p>
      ) : (
        <KanbanBoard posts={postsByStatus} onStatusChange={handleStatusChange} onEdit={handleEdit} />
      )}

      <PostEditorDialog
        open={editorOpen}
        post={activePost}
        themes={themes ?? []}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
