import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/config";
import { getMessagesForThread, createMessage } from "@/lib/db/queries";
import prisma from "@/lib/db/client";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get("threadId");
    const page = parseInt(searchParams.get("page") || "1");

    if (!threadId) {
      return NextResponse.json({ error: "threadId required" }, { status: 400 });
    }

    const result = await getMessagesForThread(threadId, page);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { threadId, body: messageBody, channel } = body;

    if (!threadId || !messageBody) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!thread || thread.teamId !== user.teamId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await createMessage({
      teamId: user.teamId,
      threadId,
      contactId: thread.contactId,
      senderId: user.id,
      body: messageBody,
      channel: channel || "SMS",
      direction: "OUTBOUND",
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
