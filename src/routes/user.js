import * as userHandler from '../handlers/user.js'

/** @type {import('fastify').FastifyPluginAsync} */
export default async function routes (app, opts) {
  app.route({
    method: 'GET',
    url: '/profile',
    schema: {
      tags: ['User'],
      summary: 'Get user profile',
      description: 'Get user profile',
      security: [app.bearerAuth],
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string', nullable: true },
            point: { type: 'number' },
            profile: {
              type: 'object',
              properties: {
                bio: { type: 'string' },
              },
              nullable: true
            }
          },
        },
        401: app.errorSchema[401],
      },
    },
    config: {
      auth: true,
    },
    handler: userHandler.profile,
  })

  app.route({
    method: 'PUT',
    url: '/profile',
    schema: {
      tags: ['User'],
      summary: 'Update user profile',
      description: 'Update user profile',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          bio: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
          },
        },
        400: app.errorSchema[400],
        401: app.errorSchema[401],
      },
    },
    config: {
      auth: true,
    },
    handler: userHandler.update,
  })
}
