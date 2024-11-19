import fs from 'fs';
import path from 'path';

import { getLogger } from 'src/lib/get-logger';
import { SpeechVoice } from 'src/types';
import { getSpeechClient } from '../../speech-clients';
import { SpeechClientBase, SpeechService } from '../../speech-clients/speech-client-base';
import { generate, GenerateParams } from './generate';
import { glueChunks, GlueChunksParams } from './glue-chunks';
import { SessionData } from './session-data';

export interface SoundSignature {
  speechService: SpeechService;
  voice: SpeechVoice;
  speed: number;
}

export interface SpeechGeneratorParams {
  sourceFilePath: string;
}

export interface SpeechGeneratorOptions {
  soundSignature: SoundSignature;
}

const baseLogger = getLogger();

let params: SpeechGeneratorParams;
let options: SpeechGeneratorOptions;
let source: string[] = [];
let outputDir = '';
let speechClient: SpeechClientBase;
let sessionData: SessionData;

const init = (initParams: SpeechGeneratorParams, initOptions: SpeechGeneratorOptions) => {
  const logger = baseLogger.child({
    module: 'SpeechGenerator',
  });
  params = initParams;
  options = initOptions;

  const client = getSpeechClient(options.soundSignature.speechService, {
    logger,
  });
  if (!client) {
    throw new Error(
      `Failed to initialize speech client for service: ${options.soundSignature.speechService}`,
    );
  }
  speechClient = client;

  const sessionDirPath = path.dirname(path.join(process.cwd(), params.sourceFilePath));
  outputDir = path.join(sessionDirPath, 'chunks');
  sessionData = new SessionData({ sessionDirPath });

  loadSource();
};

const loadSource = () => {
  const logger = baseLogger.child({
    method: 'loadSource',
  });
  logger.info(`Loading source from '${params.sourceFilePath}'`);
  const fileContent = fs.readFileSync(path.join(process.cwd(), params.sourceFilePath), 'utf8');
  source = fileContent.split('\n').map(line => line.trim());
  logger.info(`Loaded (${source.length}) lines from source file`);
};

export default {
  init,
  generate: (params: GenerateParams) =>
    generate(params, {
      outputDir,
      source,
      sessionData,
      speechClient,
      speechService: options.soundSignature.speechService,
    }),
  glueChunks: (params: GlueChunksParams) => glueChunks(params, { sessionData, source, outputDir }),
};
