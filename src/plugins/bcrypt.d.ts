declare module 'fastify' {
  interface FastifyInstance {
    bcrypt: {
      createHash: (plain: string) => Promise<string>;
      compareHash: (plain: string, hash: string) => Promise<boolean>;
    };
  }
}

export {}
