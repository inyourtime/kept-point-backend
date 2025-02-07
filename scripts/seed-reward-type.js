import { prisma } from '../src/db/prisma.js'

async function main () {
  const rewardTypes = [
    'Food',
    'Accessories',
    'Stationery',
    'Toys',
    'Beauty',
    'Electronics',
    'Apparel',
    'Line Stickers',
  ]

  await prisma.rewardType.createMany({
    data: rewardTypes.map((type) => ({ name: type })),
  })
}

main().catch(console.error)
