import { readFileSync } from 'fs'
import { join } from 'path'
import fp from 'fastify-plugin'
import Swagger from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'

const { version } = JSON.parse(
  readFileSync(
    join(new URL('.', import.meta.url).pathname, '../../package.json')
  )
)

async function swaggerGenerator (fastify, opts) {
  await fastify.register(Swagger, {
    openapi: {
      info: {
        title: 'Kept Point API',
        description: 'API documentation for Kept Point',
        version,
      },
      servers: [
        {
          url: 'http://localhost:4499',
        },
      ],
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
    exposeRoute: process.env.NODE_ENV !== 'production',
  })

  if (process.env.NODE_ENV !== 'production') {
    await fastify.register(ScalarApiReference, {
      routePrefix: '/docs',
      configuration: {
        // theme: 'bluePlanet',
        metaData: {
          title: 'Kept Point API',
        },
        hideClientButton: true,
        defaultOpenAllTags: true
      },
    })
  }
}

export default fp(swaggerGenerator, {
  name: 'swaggerGenerator',
})
