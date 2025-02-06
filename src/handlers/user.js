import { prisma } from '../db/prisma.js'

/** @type {import('fastify').RouteHandler} */
export async function profile (request, reply) {
  const { id } = request.user

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      point: true,
      profile: {
        select: { bio: true }
      }
    },
  })
  if (!user) {
    throw reply.notFound('User not found')
  }

  return user
}

/** @type {import('fastify').RouteHandler} */
export async function update (request, reply) {
  const { id } = request.user
  const { name, bio } = request.body

  const profile = bio
    ? {
        upsert: {
          create: { bio },
          update: { bio },
        }
      }
    : undefined

  await prisma.user.update({
    where: { id },
    data: {
      name,
      profile
    }
  })

  return { status: 'success' }
}
