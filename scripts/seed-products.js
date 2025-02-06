import { prisma } from '../src/db/prisma.js'
import { faker } from '@faker-js/faker'

async function main () {
  const products = Array.from({ length: 15 }).map(() => ({
    name: faker.commerce.productName(),
    point: faker.number.int({ min: 10, max: 1000, multipleOf: 10 }),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    image: faker.image.url(),
    description: faker.lorem.paragraph(),
    conditions: faker.lorem.sentence(),
  }))

  await prisma.product.createMany({
    data: products,
  })
}

main().catch(console.error)
