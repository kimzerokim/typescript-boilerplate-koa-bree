import pino from 'pino';

export const logger = pino({
  prettyPrint: {
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
  },
});
