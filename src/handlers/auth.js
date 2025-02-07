import { prisma } from '../db/prisma.js'
import { generateAccessToken } from '../utils/token.js'

/** @type {import('fastify').RouteHandler} */
export async function signup (request, reply) {
  const { email, password } = request.body

  const hash = await this.bcrypt.createHash(password)

  try {
    const newUser = await prisma.user.create({
      data: { email, password: hash },
    })

    return {
      id: newUser.id,
      email: newUser.email,
    }
  } catch (err) {
    if (err.code === 'P2002') {
      throw reply.badRequest('User already exists')
    }

    throw err
  }
}

/** @type {import('fastify').RouteHandler} */
export async function login (request, reply) {
  const { email, password } = request.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw reply.unauthorized('Email or password are incorrect')
  }

  const match = await this.bcrypt.compareHash(password, user.password)
  if (!match) {
    throw reply.unauthorized('Email or password are incorrect')
  }

  return {
    accessToken: generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    }),
  }
}

/** @type {import('fastify').RouteHandler} */
export async function me (request, reply) {
  const { id, email, name } = request.user

  return {
    id,
    email,
    name,
  }
}
