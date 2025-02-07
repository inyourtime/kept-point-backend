import * as rewardHandler from '../handlers/reward.js'

/** @type {import('fastify').FastifyPluginAsync} */
export default async function routes (app, opts) {
  app.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Reward'],
      summary: 'Get all rewards',
      description: 'Get all rewards',
      security: [app.bearerAuth],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 10 },
        },
      },
      response: {
        ...app.errorSchema,
      },
    },
    config: {
      auth: true,
    },
    handler: rewardHandler.getAll,
  })

  app.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Reward'],
      summary: 'Get reward by id',
      description: 'Get reward by id',
      security: [app.bearerAuth],
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
        ...app.errorSchema,
      },
    },
    config: {
      auth: true,
    },
    handler: rewardHandler.getOne,
  })

  app.route({
    method: 'POST',
    url: '/exchange',
    schema: {
      tags: ['Reward'],
      summary: 'Exchange reward',
      description: 'Exchange reward',
      security: [app.bearerAuth],
      body: {
        type: 'object',
        properties: {
          rewardId: {
            type: 'string',
            format: 'uuid',
            examples: ['11111111-1111-1111-1111-111111111111']
          },
        },
        required: ['rewardId'],
      },
      response: {
        ...app.errorSchema,
      },
    },
    config: {
      auth: true,
    },
    handler: rewardHandler.exchange,
  })
}
