import { prisma } from '../utils/prisma.js';

export function logAutomationEvent(postId: string, event: string, payload: Record<string, unknown>) {
  return prisma.automationEvent.create({
    data: {
      postId,
      event,
      payload
    }
  });
}
