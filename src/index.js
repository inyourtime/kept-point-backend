import build from './server.js'

async function start () {
  const port = Number(process.env.PORT) || 4499

  try {
    const server = build()
    const address = await server.listen({ port, host: '0.0.0.0' })

    console.log(`Listening on ${address}`)
    console.log(`Documentation: http://localhost:${port}/docs`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
