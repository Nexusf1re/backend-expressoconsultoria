const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function analyzeData() {
  try {
    console.log('🔍 Analisando dados do banco...\n');

    // Total de registros
    const totalSales = await prisma.sale.count();
    console.log(`📊 Total de vendas: ${totalSales}`);

    // Dados por categoria
    console.log('\n📈 Vendas por categoria:');
    const categoryStats = await prisma.sale.groupBy({
      by: ['category'],
      _count: { category: true },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } }
    });
    
    categoryStats.forEach(stat => {
      console.log(`  ${stat.category}: ${stat._count.category} vendas, $${stat._sum.amount?.toFixed(2)}`);
    });

    // Dados por região
    console.log('\n🌍 Vendas por região:');
    const regionStats = await prisma.sale.groupBy({
      by: ['region'],
      _count: { region: true },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } }
    });
    
    regionStats.forEach(stat => {
      console.log(`  ${stat.region}: ${stat._count.region} vendas, $${stat._sum.amount?.toFixed(2)}`);
    });

    // Dados por canal
    console.log('\n📱 Vendas por canal:');
    const channelStats = await prisma.sale.groupBy({
      by: ['channel'],
      _count: { channel: true },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } }
    });
    
    channelStats.forEach(stat => {
      console.log(`  ${stat.channel}: ${stat._count.channel} vendas, $${stat._sum.amount?.toFixed(2)}`);
    });

    // Período dos dados
    console.log('\n📅 Período dos dados:');
    const dateRange = await prisma.sale.aggregate({
      _min: { occurredAt: true },
      _max: { occurredAt: true }
    });
    
    console.log(`  De: ${dateRange._min.occurredAt?.toISOString().split('T')[0]}`);
    console.log(`  Até: ${dateRange._max.occurredAt?.toISOString().split('T')[0]}`);

    // Top 10 produtos
    console.log('\n🏆 Top 10 produtos:');
    const productStats = await prisma.sale.groupBy({
      by: ['product'],
      _count: { product: true },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 10
    });
    
    productStats.forEach(stat => {
      console.log(`  ${stat.product}: ${stat._count.product} vendas, $${stat._sum.amount?.toFixed(2)}`);
    });

  } catch (error) {
    console.error('❌ Erro ao analisar dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeData();
