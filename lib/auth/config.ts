import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db/client";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { usePlural: true, provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },
});

export async function getCurrentUser(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session?.user || null;
}
