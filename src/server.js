import Fastify from 'fastify'
import fp from 'fastify-plugin'
import FastifyCors from '@fastify/cors'
import FastifySensible from '@fastify/sensible'

import authentication from './plugins/authentication.js'
import swagger from './plugins/swagger.js'

function buildServer () {
  const app = Fastify({ logger: false })

  app.register(FastifyCors, {
    origin: '*',
  })
  app.register(FastifySensible, { sharedSchemaId: 'HttpError' })

  app.register(swagger)
  app.register(authentication)
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
  app.register(import('./routes/product.js'), { prefix: '/products' })
}

/**
 * @param {import("fastify").FastifyInstance} app
 */
function decorateFastifyInstance (app) {
  app.decorate('bearerAuth', { bearerAuth: [] })
}

export default buildServer
