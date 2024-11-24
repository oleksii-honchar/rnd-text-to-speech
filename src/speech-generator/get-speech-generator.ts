import path from 'path';

import { logger } from '../lib/logger';
import { ChunkGenerator } from './chunk-generator';
import { SessionData } from './session-data';
import { SourceData } from './source-data';
import { getSpeechClient } from './speech-clients';
import { SpeechGenerator } from './speech-generator';
import { SoundSignature } from './types';
export interface GetSpeechGeneratorParams {
  sourceFilePath: string;
  soundSignature: SoundSignature;
}

export const getSpeechGenerator = (params: GetSpeechGeneratorParams) => {
  const { sourceFilePath, soundSignature } = params;

  const sessionDirPath = path.dirname(path.join(process.cwd(), sourceFilePath));
  const outputDir = path.join(sessionDirPath, 'chunks');

  const sessionData = new SessionData({ sessionDirPath });
  const sourceData = new SourceData({ sourceFilePath }, { logger });

  const speechClient = getSpeechClient(soundSignature.speechService, { logger });
  if (!speechClient) {
    throw new Error(`Failed to initialize speech client for service: ${soundSignature.speechService}`);
  }

  const chunkGenerator = new ChunkGenerator(
    {
      outputDir,
      soundSignature,
    },
    { logger, sessionData, speechClient },
  );

  const speechGenerator = new SpeechGenerator(
    {
      sourceFilePath,
      soundSignature,
    },
    {
      logger,
      chunkGenerator,
      sessionData,
      sourceData,
    },
  );

  return speechGenerator;
};
