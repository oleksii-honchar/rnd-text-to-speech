import pino from 'pino';

import pkg from 'package.json';

const name = `${pkg.name}@${pkg.version}`;

export const logger = pino({
  name,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
  level: process.env.LOG_LEVEL ?? 'info',
});

export type Logger = typeof logger;
