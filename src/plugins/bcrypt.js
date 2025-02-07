import fp from 'fastify-plugin'
import { compare, genSaltSync, hash } from 'bcrypt'

export default fp(async (app) => {
  const createHash = (plain) => hash(plain, genSaltSync(10))
  const compareHash = (plain, hash) => compare(plain, hash)

  const bcrypt = {
    createHash,
    compareHash,
  }

  app.decorate('bcrypt', bcrypt)
})
