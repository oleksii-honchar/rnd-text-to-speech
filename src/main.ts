import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import config from 'config';

import { AppModule } from './app.module';

const runtimePort = config.get<number>('runtime.port');

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  await app.listen(runtimePort);
  logger.log(`Application is running on: http://localhost:${runtimePort}`);
}
bootstrap();
