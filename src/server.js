import Fastify from 'fastify'
import fp from 'fastify-plugin'
import FastifyCors from '@fastify/cors'
import FastifySensible from '@fastify/sensible'

import { errorSchema } from './schemas/index.js'

function buildServer () {
  const app = Fastify({ logger: false })

  app.register(FastifyCors, {
    origin: '*',
  })
  app.register(FastifySensible, { sharedSchemaId: 'HttpError' })

  app.register(import('./plugins/swagger.js'))
  app.register(import('./plugins/authentication.js'))
  app.register(import('./plugins/bcrypt.js'))
  app.register(fp(decorateFastifyInstance))

  app.get('/', () => ({ name: 'Kept Point API' }))

  const v1Config = { prefix: '/v1' }
  app.register(createRoutes, v1Config)

  return app
}

/**
 * @param {import("fastify").FastifyInstance} app
 */
function createRoutes (app) {
  app.register(import('./routes/auth.js'), { prefix: '/auth' })
  app.register(import('./routes/user.js'), { prefix: '/user' })
  app.register(import('./routes/reward.js'), { prefix: '/rewards' })
}

/**
 * @param {import("fastify").FastifyInstance} app
 */
function decorateFastifyInstance (app) {
  app.decorate('bearerAuth', { bearerAuth: [] })
  app.decorate('errorSchema', errorSchema)
}

export default buildServer
