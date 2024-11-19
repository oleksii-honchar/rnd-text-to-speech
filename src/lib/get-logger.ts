import pino from 'pino';

import pkg from 'package.json';

const name = `${pkg.name}@${pkg.version}`;

const logger = pino({
  name,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
  level: process.env.LOG_LEVEL || 'info',
});

export const getLogger = () => logger;
