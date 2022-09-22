import { dataSource } from '@/dataSource';
import { logger } from '@/logger';

// Playground for typescript and library.
// You can run below scripts using `yarn playground-script`
(async () => {
  logger.info('Playground');
  await dataSource.initialize();

  await dataSource.destroy();
  process.exit(0);
})();
