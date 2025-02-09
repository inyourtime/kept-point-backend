import * as authHandler from '../handlers/auth.js'

/** @type {import('fastify').FastifyPluginAsync} */
export default async function routes (app, opts) {
  app.route({
    method: 'POST',
    url: '/signup',
    schema: {
      tags: ['Authentication'],
      summary: 'Signup',
      description: 'Create a new user',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
        required: ['email', 'password'],
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
          },
        },
        ...app.errorSchema,
      },
      hide: true
    },
    config: {
      auth: false,
    },
    handler: authHandler.signup,
  })

  app.route({
    method: 'POST',
    url: '/login',
    schema: {
      tags: ['Authentication'],
      summary: 'Login',
      description: 'Login with email and password',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
        required: ['email', 'password'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
          },
        },
        400: app.errorSchema[400],
        401: app.errorSchema[401],
      },
    },
    config: {
      auth: false,
    },
    handler: authHandler.login,
  })

  app.route({
    method: 'GET',
    url: '/me',
    schema: {
      tags: ['Authentication'],
      summary: 'Me',
      description: 'Get current user',
      security: [app.bearerAuth],
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string', nullable: true },
          },
        },
        401: app.errorSchema[401],
      },
    },
    config: {
      auth: true,
    },
    handler: authHandler.me,
  })
}
