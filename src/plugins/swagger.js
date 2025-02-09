import { readFileSync } from 'fs'
import { join } from 'path'
import fp from 'fastify-plugin'
import Swagger from '@fastify/swagger'
import Scalar from './scalar/scalar.js'

const { version } = JSON.parse(
  readFileSync(
    join(new URL('.', import.meta.url).pathname, '../../package.json')
  )
)

async function swaggerGenerator (fastify, opts) {
  const servers = {
    local: {
      url: 'http://localhost:4499',
      description: 'Local server',
    },
    production: {
      url: 'https://kept-point-backend.vercel.app',
      description: 'Production server',
    },
  }

  const server = process.env.NODE_ENV === 'production'
    ? servers['production']
    : servers['local']

  await fastify.register(Swagger, {
    openapi: {
      info: {
        title: 'Kept Point API',
        description: 'API documentation for Kept Point',
        version,
      },
      servers: [server],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  })

  await fastify.register(Scalar, {
    prefix: '/docs',
    scalarConfig: {
      metaData: {
        title: 'Kept Point API',
      },
      theme: 'fastify',
      hideClientButton: true,
      defaultOpenAllTags: true,
    },
  })
}

export default fp(swaggerGenerator, {
  name: 'swaggerGenerator',
})
