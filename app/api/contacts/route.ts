import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/config";
import prisma from "@/lib/db/client";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get("id");

    if (contactId) {
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        include: {
          messages: { orderBy: { createdAt: "desc" } },
          threads: true,
          notes: true,
        },
      });
      return NextResponse.json(contact);
    }

    const contacts = await prisma.contact.findMany({
      where: { teamId: user.teamId },
      orderBy: { lastMessageAt: "desc" },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
