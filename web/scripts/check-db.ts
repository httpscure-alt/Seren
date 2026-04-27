import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.skincareProduct.count();
  const activeCount = await prisma.skincareProduct.count({ where: { isActive: true } });
  const sample = await prisma.skincareProduct.findFirst();
  
  console.log(`Total products: ${count}`);
  console.log(`Active products: ${activeCount}`);
  if (sample) {
    console.log(`Sample product: ${sample.brand} - ${sample.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
