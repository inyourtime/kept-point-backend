import * as productHandler from '../handlers/product.js'
import { errorSchema } from '../schemas/index.js'

/** @type {import('fastify').FastifyPluginAsync} */
export default async function routes (app, opts) {
  app.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Product'],
      summary: 'Get all products',
      description: 'Get all products',
      security: [app.bearerAuth],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 10 },
        },
      },
      response: {
        ...errorSchema,
      },
    },
    config: {
      auth: true,
    },
    handler: productHandler.getAll,
  })

  app.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Product'],
      summary: 'Get product by id',
      description: 'Get product by id',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            examples: ['11111111-1111-1111-1111-111111111111']
          },
        },
      },
      response: {
        ...errorSchema,
      },
    },
    config: {
      auth: true,
    },
    handler: productHandler.getOne,
  })

  app.route({
    method: 'POST',
    url: '/exchange',
    schema: {
      tags: ['Product'],
      summary: 'Exchange product',
      description: 'Exchange product',
      security: [app.bearerAuth],
      body: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            format: 'uuid',
            examples: ['11111111-1111-1111-1111-111111111111']
          },
        },
        required: ['productId'],
      },
      response: {
        ...errorSchema,
      },
    },
    config: {
      auth: true,
    },
    handler: productHandler.exchange,
  })
}
