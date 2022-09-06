import dotenv from 'dotenv';
import fs from 'fs';

// import { logger } from './logger';

const environment = process.env.ENV || 'local';
const isDevMode = environment.includes('local');
const isSync = (process.env.SYNC || 'False').includes('True');

function applyEnv(environment: string) {
  const candidateEnvFilePath = `${environment}.env` || 'local.env';
  const targetEnvFilePath = (() => {
    if (fs.existsSync(candidateEnvFilePath)) {
      return candidateEnvFilePath;
    }
    return null;
  })();

  if (targetEnvFilePath) {
    // logger.info(`Using environment file ${targetEnvFilePath}...`);
    dotenv.config({
      path: targetEnvFilePath,
    });
    return;
  }

  throw new Error(`${candidateEnvFilePath} not found. Please provice proper ENV environment variable.`);
}

if (process.env.ENV) {
  applyEnv(process.env.ENV);
}
// else {
//   console.warn('ENV environment variable is not provided. Using default configuration...');
// }

export interface Config {
  [key: string]: number | boolean | string | string[];
  port: number;
  debugLogging: boolean;
  dbsslconn: boolean;
  jwtSecret: string;
  environment: string;
  isDevMode: boolean;
  DB_HOST: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_ENTITIES_PATH: string[];
  REDIS_HOST: string;
  REDIS_PORT: number;
  PM2_INSTANCE_NUM: number;
  PM2_INDEX: number;
}

const config: Config = {
  port: +(process.env.PORT || 4000),
  debugLogging: isDevMode,
  dbsslconn: false,
  jwtSecret: process.env.JWT_SECRET || 'Example',
  environment,
  isDevMode,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || '5432',
  DB_USER: process.env.DB_USER || 'user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'pass',
  DB_NAME: process.env.DB_NAME || 'project',
  DB_ENTITIES_PATH: [...(isDevMode || isSync ? ['src/entity/*.ts'] : ['dist/entity/*.js'])],
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: +(process.env.REDIS_PORT || '6379'),
  PM2_INSTANCE_NUM: process.env.ENV !== 'production' ? 1 : 4,
  PM2_INDEX: parseInt(process.env.pm_id, 10) || 0,
};

export { config };
