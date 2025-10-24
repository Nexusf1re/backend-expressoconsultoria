import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  'Electronics',
  'Home & Garden',
  'Clothing',
  'Books',
  'Sports',
  'Beauty',
  'Automotive',
  'Food & Beverage',
];

const products = [
  'Smartphone',
  'Laptop',
  'Headphones',
  'Tablet',
  'Smart Watch',
  'Gaming Console',
  'Camera',
  'Speaker',
  'Monitor',
  'Keyboard',
  'Mouse',
  'Webcam',
  'Router',
  'Charger',
  'Case',
];

const regions = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Latin America',
  'Middle East',
  'Africa',
];

const channels = [
  'Online',
  'Store',
  'Mobile App',
  'Phone',
  'Email',
  'Social Media',
];

function getRandomElement<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex]!;
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function getRandomAmount(): number {
  return Math.random() * 1000 + 10; // Between 10 and 1010
}

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.sale.deleteMany();
  console.log('🗑️  Cleared existing sales data');

  // Generate sales data for the last 6 months
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);

  const sales = [];
  const numberOfSales = 5000;

  console.log(`📊 Generating ${numberOfSales} sales records...`);

  for (let i = 0; i < numberOfSales; i++) {
    const occurredAt = getRandomDate(startDate, endDate);
    
    sales.push({
      occurredAt,
      category: getRandomElement(categories),
      product: getRandomElement(products),
      amount: getRandomAmount(),
      region: getRandomElement(regions),
      channel: getRandomElement(channels),
    });

    // Batch insert every 1000 records
    if (sales.length === 1000) {
      await prisma.sale.createMany({
        data: sales,
        skipDuplicates: true,
      });
      console.log(`✅ Inserted ${sales.length} sales records`);
      sales.length = 0; // Clear array
    }
  }

  // Insert remaining records
  if (sales.length > 0) {
    await prisma.sale.createMany({
      data: sales,
      skipDuplicates: true,
    });
    console.log(`✅ Inserted final ${sales.length} sales records`);
  }

  const totalSales = await prisma.sale.count();
  console.log(`🎉 Seed completed! Total sales: ${totalSales}`);

  // Show some statistics
  const categoryStats = await prisma.sale.groupBy({
    by: ['category'],
    _count: { category: true },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
  });

  console.log('\n📈 Sales by category:');
  categoryStats.forEach((stat) => {
    console.log(
      `  ${stat.category}: ${stat._count.category} sales, $${stat._sum.amount?.toFixed(2)}`
    );
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
