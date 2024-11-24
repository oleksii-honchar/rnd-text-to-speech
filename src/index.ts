import pino from 'pino';

import pkg from 'package.json';

import { PlayhtVoices } from './speech-generator/speech-clients/playht-client';
import { SpeechServices } from './speech-generator/speech-clients/speech-client-base';
import { SpeechGenerator } from './speech-generator/speech-generator';

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
  level: process.env.LOG_LEVEL ?? 'info',
});

logger.info('Starting app');
logger.info(`Working directory: '${process.cwd()}'`);

const speechGenerator = new SpeechGenerator(
  {
    sourceFilePath: './sessions/#1-hypnotherapy-session/source.txt',
  },
  {
    logger,
    speechService: SpeechServices.Playht,
  },
);

try {
  speechGenerator.generate({ chunks: [0], voice: PlayhtVoices.Autumn, speed: 0.8 });
} catch (error) {
  logger.error(error);
}
