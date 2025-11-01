import { prisma } from '../utils/prisma.js';

export function getDashboardSummary(userId: string, range: { start: Date; end: Date }) {
  return prisma.$transaction(async (tx) => {
    const posts = await tx.post.findMany({
      where: {
        userId,
        createdAt: {
          gte: range.start,
          lte: range.end
        }
      },
      include: { metrics: true }
    });

    const totals = posts.reduce(
      (acc, post) => {
        acc.posts += 1;
        acc.leads += post.metrics?.leads ?? 0;
        acc.engagement += post.metrics?.engagement ?? 0;
        acc.impressions += post.metrics?.impressions ?? 0;
        return acc;
      },
      { posts: 0, leads: 0, engagement: 0, impressions: 0 }
    );

    const themePerformance = await tx.theme.findMany({
      where: { userId },
      include: {
        posts: {
          where: {
            createdAt: {
              gte: range.start,
              lte: range.end
            }
          },
          include: { metrics: true }
        }
      }
    });

    const themes = themePerformance.map((theme) => {
      const aggregates = theme.posts.reduce(
        (acc, post) => {
          acc.posts += 1;
          acc.leads += post.metrics?.leads ?? 0;
          acc.engagement += post.metrics?.engagement ?? 0;
          acc.impressions += post.metrics?.impressions ?? 0;
          return acc;
        },
        { posts: 0, leads: 0, engagement: 0, impressions: 0 }
      );

      return {
        id: theme.id,
        title: theme.title,
        objective: theme.objective,
        format: theme.format,
        description: theme.description,
        ...aggregates
      };
    });

    return { totals, themes };
  });
}

export function upsertMetrics(postId: string, data: { impressions: number; engagement: number; leads: number }) {
  return prisma.metrics.upsert({
    where: { postId },
    update: data,
    create: {
      postId,
      ...data
    }
  });
}
