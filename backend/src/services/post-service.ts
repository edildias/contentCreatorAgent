import type { PostStatus } from '@prisma/client';

import { prisma } from '../utils/prisma.js';

export function listPosts(userId: string, filters?: { themeId?: string; status?: PostStatus }) {
  return prisma.post.findMany({
    where: {
      userId,
      ...(filters?.themeId ? { themeId: filters.themeId } : {}),
      ...(filters?.status ? { status: filters.status } : {})
    },
    include: {
      theme: true,
      metrics: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export function createPost(userId: string, data: {
  themeId: string;
  idea: string;
  title: string;
  text: string;
  imageUrl?: string | null;
  status?: PostStatus;
  scheduledAt?: Date | null;
  publishNow?: boolean;
}) {
  return prisma.post.create({
    data: {
      userId,
      themeId: data.themeId,
      idea: data.idea,
      title: data.title,
      text: data.text,
      imageUrl: data.imageUrl ?? null,
      status: data.status ?? 'BACKLOG',
      scheduledAt: data.scheduledAt ?? null,
      publishNow: data.publishNow ?? false
    },
    include: {
      theme: true,
      metrics: true
    }
  });
}

export async function updatePost(postId: string, userId: string, data: Partial<{
  themeId: string;
  idea: string;
  title: string;
  text: string;
  imageUrl?: string | null;
  status?: PostStatus;
  scheduledAt?: Date | null;
  publishNow?: boolean;
}>) {
  const post = await prisma.post.findFirst({ where: { id: postId, userId } });
  if (!post) {
    return null;
  }

  return prisma.post.update({
    where: { id: postId },
    data,
    include: {
      theme: true,
      metrics: true
    }
  });
}

export function deletePost(postId: string, userId: string) {
  return prisma.post.deleteMany({ where: { id: postId, userId } });
}
