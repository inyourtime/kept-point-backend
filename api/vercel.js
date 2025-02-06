import build from '../src/server.js'

const app = build()

/**
 * The Vercel adapter for Fastify
 */
export default async (req, res) => {
  await app.ready()
  app.server.emit('request', req, res)
}
