import { compare, genSaltSync, hash } from 'bcrypt'

export const createHash = (plain) => hash(plain, genSaltSync(10))

export const compareHash = (plain, hash) => compare(plain, hash)
