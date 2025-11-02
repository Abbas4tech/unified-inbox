import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.user.deleteMany({});
  await prisma.team.deleteMany({});

  // Create team
  const team = await prisma.team.create({
    data: {
      name: "Demo Team",
      slug: "demo-team",
    },
  });

  // Create user
  const user = await prisma.user.create({
    data: {
      email: "admin@demo.com",
      name: "Admin User",
      password: "demo@123",
      role: "ADMIN",
      teamId: team.id,
    },
  });

  // Create contact
  const contact = await prisma.contact.create({
    data: {
      teamId: team.id,
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+1234567890",
      email: "john@example.com",
    },
  });

  // Create thread
  const thread = await prisma.thread.create({
    data: {
      teamId: team.id,
      contactId: contact.id,
    },
  });

  // Create message
  await prisma.message.create({
    data: {
      teamId: team.id,
      threadId: thread.id,
      contactId: contact.id,
      body: "Hello! This is a test message.",
      channel: "SMS",
      direction: "INBOUND",
    },
  });

  console.log("✅ Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
