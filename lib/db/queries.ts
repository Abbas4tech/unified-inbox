import prisma from "./client";

export async function getThreadsForTeam(teamId: string, status?: string) {
  return await prisma.thread.findMany({
    where: {
      teamId,
      ...(status && { status }),
    },
    include: {
      contact: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { lastMessageAt: "desc" },
  });
}

export async function getMessagesForThread(
  threadId: string,
  page: number = 1,
  limit: number = 50
) {
  const skip = (page - 1) * limit;

  const messages = await prisma.message.findMany({
    where: { threadId },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      attachments: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  const total = await prisma.message.count({ where: { threadId } });

  return {
    messages: messages.reverse(),
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function createMessage(data: any) {
  return await prisma.message.create({
    data,
    include: {
      sender: { select: { name: true, image: true } },
    },
  });
}
