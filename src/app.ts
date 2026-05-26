import Fastify from 'fastify';

export function buildApp() {
  const app = Fastify({ logger: false });

  app.get('/', async () => {
    return { message: 'Hello World' };
  });

  return app;
}
