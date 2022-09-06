import { dataSource } from '../dataSource';
import { logger } from '../logger';

(async () => {
  logger.info('Bree test job');

  // Since this job run as javascript-worker,
  // External bree jobs needs to connect database before execution.

  // Establish DB connection
  await dataSource.initialize();
  await dataSource.destroy();
  process.exit(0);
})();
