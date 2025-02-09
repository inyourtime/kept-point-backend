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
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              point: { type: 'number' },
              startDate: { type: 'string', format: 'date-time' },
              endDate: { type: 'string', format: 'date-time' },
              image: { type: 'string' },
              description: { type: 'string', nullable: true },
              rewardType: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        400: app.errorSchema[400],
        401: app.errorSchema[401],
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
        200: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            point: { type: 'number' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            image: { type: 'string' },
            description: { type: 'string', nullable: true },
            conditions: { type: 'string', nullable: true },
            rewardType: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
              },
            },
            isExchanged: { type: 'boolean' },
          },
        },
        400: app.errorSchema[400],
        401: app.errorSchema[401],
        404: app.errorSchema[404],
      },
    },
    config: {
      auth: true,
    },
    handler: rewardHandler.getOne,
  })

  app.route({
    method: 'GET',
    url: '/types',
    schema: {
      tags: ['Reward'],
      summary: 'Get reward types',
      description: 'Get reward types',
      security: [app.bearerAuth],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
            },
          },
        },
        401: app.errorSchema[401],
      },
    },
    config: {
      auth: true,
    },
    handler: rewardHandler.getRewardTypes,
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
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            point: { type: 'number' },
          },
        },
        400: app.errorSchema[400],
        401: app.errorSchema[401],
        404: app.errorSchema[404],
      },
    },
    config: {
      auth: true,
    },
    handler: rewardHandler.exchange,
  })
}
