import Fastify from 'fastify';
import { authRoutes } from './modules/auth';
import { usersRoutes } from './modules/users';
import { chirpsRoutes } from './modules/chirps';
import { timelinesRoutes } from './modules/timelines';

export function buildApp({ logger = true }: { logger?: boolean } = {}) {
  const app = Fastify({ logger });

  app.register(authRoutes, { prefix: '/auth' });
  app.register(usersRoutes, { prefix: '/users' });
  app.register(chirpsRoutes, { prefix: '/chirps' });
  app.register(timelinesRoutes, { prefix: '/timelines' });

  return app;
}
