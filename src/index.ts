import pino from 'pino';

import pkg from 'package.json';

const name = `${pkg.name}@${pkg.version}`;
const logger = pino({
  name,
});
logger.info('Starting app');
