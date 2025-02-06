import fp from 'fastify-plugin'
import { verifyToken } from '../utils/token.js'

export default fp(async (app) => {
  app.addHook('onRequest', async (request, reply) => {
    if (request.is404) return

    const routeOptions = request.routeOptions.config
    if (!routeOptions.auth) return

    const authHeader = request.headers.authorization
    if (!authHeader) {
      throw reply.unauthorized('Missing authorization header')
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw reply.unauthorized('Invalid authorization header')
    }

    const { error, result } = verifyToken(parts[1])
    if (error) {
      throw reply.unauthorized('Invalid token')
    }

    request.user = result
  })
})
