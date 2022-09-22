import 'reflect-metadata';
import Bree from 'bree';
import http from 'http';
import Koa from 'koa';
import path from 'path';

import { createApp } from '@/app';
import { config } from '@/config';
import { dataSource } from '@/dataSource';
import { logger } from '@/logger';

function typescript_worker() {
  const path = require('path');
  require('ts-node').register();
  const workerData = require('worker_threads').workerData;
  require(path.resolve(__dirname, workerData.__filename));
}

(async () => {
  logger.info(`${path.resolve(__dirname)}`);
  logger.info(`PM2 Instance Num: ${config.PM2_INSTANCE_NUM}`);
  logger.info(`PM2 Instance Index: ${config.PM2_INDEX}`);
  logger.info('#####################');
  if (config.PM2_INDEX === 0) {
    logger.info('Using following configuration...');
    Object.keys(config).forEach((key: string) => {
      const valueToDisplay = key === 'DB_PASSWORD' ? '*' : (config[key] as string);
      logger.info(`${key}: ${valueToDisplay}`);
    });
  }

  // Establish DB connection
  await dataSource.initialize();
  logger.info('DB connection established');

  // Worker scheduler
  const bree = new Bree({
    logger: false,
    root: false,
    jobs: config.isDevMode
      ? [
          {
            name: 'testJob-ts',
            path: typescript_worker,
            interval: '1m',
            worker: {
              workerData: {
                __filename: path.join('src/job/', 'testJob.ts'),
              },
            },
          },
        ]
      : [
          {
            name: 'testJob-js',
            interval: '1m',
            path: path.join(__dirname, 'job/', 'testJob.js'),
          },
        ],
  });
  await bree.start();

  // Koa webserver
  const app: Koa = await createApp();
  const port: number = parseInt(process.env.PORT || '4000', 10);
  const server = http.createServer(app.callback());
  server.listen(port);
  logger.info(`Server has started on port: ${port}`);
})();
