import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma.js";

const seed = async () => {
  const password = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@support.com",
    },
    update: {
      role: "ADMIN",
    },
    create: {
      name: "Support Admin",
      email: "admin@support.com",
      password,
      role: "ADMIN",
    },
  });

  const agentPassword = await bcrypt.hash("Agent@123", 10);

  const agent = await prisma.user.upsert({
    where: {
      email: "agent@support.com",
    },
    update: {
      role: "AGENT",
    },
    create: {
      name: "Support Agent",
      email: "agent@support.com",
      password: agentPassword,
      role: "AGENT",
    },
  });

  console.log("Admin created:", admin.email);
  console.log("Agent created:", agent.email);
};

seed()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
