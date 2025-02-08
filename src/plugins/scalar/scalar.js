/** @type {import('fastify').FastifyPluginAsync} */
export default async function (app, opts) {
  const cdn = opts.cdn || 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'
  const scalarConfig = {
    ...opts.scalarConfig,
    spec: {
      url: `${opts.prefix}/openapi.json`,
    },
  }

  app.route({
    method: 'GET',
    url: '/',
    schema: {
      hide: true,
    },
    handler: (_, reply) => {
      reply.type('text/html').send(
        htmlTemplate({
          cdn,
          serializedOptions: JSON.stringify(scalarConfig)
            .split('"')
            .join('&quot;'),
        })
      )
    },
  })

  app.route({
    method: 'GET',
    url: '/openapi.json',
    schema: {
      hide: true,
    },
    handler: () => {
      return app.swagger()
    },
  })
}

function htmlTemplate (opts) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Scalar API Reference</title>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1" />
    </head>
    <body>
      <script
        id="api-reference"
        type="application/json"
        data-configuration="${opts.serializedOptions}"></script>
      <script src="${opts.cdn}"></script>
    </body>
    </html>
  `
}
