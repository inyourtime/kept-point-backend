import { prisma } from '../src/db/prisma.js'
import { faker } from '@faker-js/faker'

async function main () {
  const rewardTypes = await prisma.rewardType.findMany()

  const rewards = Array.from({ length: 15 }).map(() => ({
    name: faker.commerce.productName(),
    point: faker.number.int({ min: 10, max: 1000, multipleOf: 10 }),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    image: faker.image.url(),
    description: faker.lorem.paragraph(),
    conditions: faker.lorem.sentence(),
    rewardTypeId:
      rewardTypes[Math.floor(Math.random() * rewardTypes.length)].id,
  }))

  await prisma.reward.createMany({
    data: rewards,
  })
}

main().catch(console.error)
