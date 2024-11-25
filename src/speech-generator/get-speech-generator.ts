import path from 'path';

import { logger } from '../lib/logger';
import { ChunkGenerator } from './chunk-generator';
import { CompositionAssembler } from './composition-assembler';
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
  const chunksOutputDir = path.join(sessionDirPath, 'chunks');
  const compositionOutputDir = path.join(sessionDirPath, 'compositions');

  const sessionData = new SessionData({ sessionDirPath });
  const sourceData = new SourceData({ sourceFilePath }, { logger });

  const speechClient = getSpeechClient(soundSignature.speechService, { logger });
  if (!speechClient) {
    throw new Error(`Failed to initialize speech client for service: ${soundSignature.speechService}`);
  }

  const chunkGenerator = new ChunkGenerator(
    {
      outputDir: chunksOutputDir,
      soundSignature,
    },
    { logger, sessionData, speechClient },
  );

  const compositionAssembler = new CompositionAssembler(
    {
      outputDir: compositionOutputDir,
    },
    { logger, sessionData, soundSignature },
  );

  const speechGenerator = new SpeechGenerator(
    {
      sourceFilePath,
      soundSignature,
    },
    {
      logger,
      chunkGenerator,
      compositionAssembler,
      sessionData,
      sourceData,
    },
  );

  return speechGenerator;
};
