import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { config } from './config';

export const dataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: parseInt(config.DB_PORT, 10),
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: false,
  logging: false,
  entities: config.DB_ENTITIES_PATH,
  extra: {
    ssl: config.dbsslconn,
  },
});
