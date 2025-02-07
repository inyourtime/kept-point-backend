import { prisma } from '../db/prisma.js'

/** @type {import('fastify').RouteHandler} */
export async function getAll (request, reply) {
  const { page, limit } = request.query

  const rewards = await prisma.reward.findMany({
    select: {
      id: true,
      name: true,
      point: true,
      startDate: true,
      endDate: true,
      image: true,
      description: true,
      rewardType: {
        select: {
          name: true
        }
      }
    },
    where: { startDate: { lte: new Date() } },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
  })

  return rewards
}

/** @type {import('fastify').RouteHandler} */
export async function getOne (request, reply) {
  const { id: userId } = request.user
  const { id } = request.params

  const reward = await prisma.reward.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      point: true,
      startDate: true,
      endDate: true,
      image: true,
      description: true,
      conditions: true,
      rewardType: {
        select: {
          name: true
        }
      },
      UserReward: {
        where: { userId },
        select: {
          id: true
        }
      },
    },
  })
  if (!reward) {
    throw reply.notFound('Reward not found')
  }

  const { UserReward, ...rest } = reward

  return {
    ...rest,
    isExchanged: UserReward.length > 0
  }
}

/** @type {import('fastify').RouteHandler} */
export async function exchange (request, reply) {
  const { id: userId } = request.user
  const { rewardId } = request.body

  const reward = await prisma.reward.findUnique({
    where: { id: rewardId },
    select: {
      id: true,
      point: true,
      startDate: true,
      endDate: true,
      UserReward: {
        where: { userId },
        select: {
          id: true
        }
      }
    }
  })
  if (!reward) {
    throw reply.notFound('Reward not found')
  }

  // check if the user has already exchanged the reward
  if (reward.UserReward.length > 0) {
    throw reply.badRequest('You already exchanged this reward')
  }

  // check start date and end date
  if (reward.startDate.getTime() > new Date().getTime()) {
    throw reply.badRequest('Reward is not available yet')
  }
  if (reward.endDate.getTime() < new Date().getTime()) {
    throw reply.badRequest('Reward is not available anymore')
  }

  // check if the user has enough points
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      point: true
    }
  })
  if (user.point < reward.point) {
    throw reply.badRequest('You do not have enough points')
  }

  const [result] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        point: user.point - reward.point
      }
    }),
    prisma.userReward.create({
      data: {
        userId,
        rewardId
      }
    })
  ])

  return {
    status: 'success',
    point: result.point
  }
}
