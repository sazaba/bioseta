import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Encriptamos "Bioseta2025" para que sea segura
  const password = await hash("Bioseta2025", 12);

  // 2. Insertamos el usuario
  const user = await prisma.user.upsert({
    where: { email: "bioseta@admin.com" },
    update: {},
    create: {
      email: "bioseta@admin.com",
      name: "Sebastian",
      password: password, // Aquí va la versión encriptada
    },
  });

  console.log("🌱 Usuario Creado:", user.email);
  console.log("🔑 Contraseña:", "Bioseta2025");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });