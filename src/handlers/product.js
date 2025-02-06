import { prisma } from '../db/prisma.js'

/** @type {import('fastify').RouteHandler} */
export async function getAll (request, reply) {
  const { page, limit } = request.query

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      point: true,
      startDate: true,
      endDate: true,
      image: true,
      description: true,
    },
    where: { startDate: { lte: new Date() } },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
  })

  return products
}

/** @type {import('fastify').RouteHandler} */
export async function getOne (request, reply) {
  const { id: userId } = request.user
  const { id } = request.params

  const product = await prisma.product.findUnique({
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
      UserProduct: {
        where: { userId },
        select: {
          id: true
        }
      }
    },
  })
  if (!product) {
    throw reply.notFound('Product not found')
  }

  const { UserProduct, ...rest } = product

  return {
    ...rest,
    isPurchased: UserProduct.length > 0
  }
}

/** @type {import('fastify').RouteHandler} */
export async function exchange (request, reply) {
  const { id: userId } = request.user
  const { productId } = request.body

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      point: true,
      startDate: true,
      endDate: true,
      UserProduct: {
        where: { userId },
        select: {
          id: true
        }
      }
    }
  })
  if (!product) {
    throw reply.notFound('Product not found')
  }

  // check if the user has already purchased the product
  if (product.UserProduct.length > 0) {
    throw reply.badRequest('You already purchased this product')
  }

  // check start date and end date
  if (product.startDate.getTime() > new Date().getTime()) {
    throw reply.badRequest('Product is not available yet')
  }
  if (product.endDate.getTime() < new Date().getTime()) {
    throw reply.badRequest('Product is not available anymore')
  }

  // check if the user has enough points
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      point: true
    }
  })
  if (user.point < product.point) {
    throw reply.badRequest('You do not have enough points')
  }

  const [result] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        point: user.point - product.point
      }
    }),
    prisma.userProduct.create({
      data: {
        userId,
        productId
      }
    })
  ])

  return {
    status: 'success',
    point: result.point
  }
}
