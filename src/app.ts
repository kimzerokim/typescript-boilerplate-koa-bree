import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import 'reflect-metadata';

import { router } from './routes/routes';
import { jwtMiddleware } from './utils/authTokenUtil';

export async function createApp(): Promise<Koa> {
  const app = new Koa();

  app.context.user = null;

  // Provides important security headers to make your app more secure
  app.use(helmet());

  // Enable cors with default options
  app.use(cors({ credentials: true }));

  // Enable bodyParser with default options
  app.use(bodyParser());

  app.use(jwtMiddleware);

  app.use(router.routes()).use(router.allowedMethods());

  return app;
}
