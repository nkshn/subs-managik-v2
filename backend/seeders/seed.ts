import { PrismaClient } from "@prisma/client";
import { seedServices } from "./service.seeder";

const prisma = new PrismaClient()

async function main() {
  // eslint-disable-next-line no-console
  console.log("------------ START SEEDING ------------")

  await seedServices(prisma)

  // eslint-disable-next-line no-console
  console.log("------------ END OF SEEDING ------------")
}

main()
  // eslint-disable-next-line no-console
  .catch(e => console.error("Seeding error: ", e))
  .finally(async () => {
    await prisma.$disconnect()
  })