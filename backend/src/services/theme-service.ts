import { prisma } from '../utils/prisma.js';

export function listThemes(userId: string) {
  return prisma.theme.findMany({
    where: { userId },
    include: {
      posts: {
        include: { metrics: true }
      }
    }
  });
}

export function createTheme(userId: string, data: { title: string; description: string; objective: string; format: string }) {
  return prisma.theme.create({
    data: {
      title: data.title,
      description: data.description,
      objective: data.objective,
      format: data.format,
      userId
    },
    include: {
      posts: {
        include: { metrics: true }
      }
    }
  });
}

export async function updateTheme(
  themeId: string,
  userId: string,
  data: Partial<{ title: string; description: string; objective: string; format: string }>
) {
  const theme = await prisma.theme.findFirst({ where: { id: themeId, userId } });
  if (!theme) {
    return null;
  }

  return prisma.theme.update({
    where: { id: themeId },
    data,
    include: {
      posts: {
        include: { metrics: true }
      }
    }
  });
}

export function deleteTheme(themeId: string, userId: string) {
  return prisma.theme.deleteMany({ where: { id: themeId, userId } });
}
