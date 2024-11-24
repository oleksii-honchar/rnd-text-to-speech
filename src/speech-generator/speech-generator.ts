import { Logger } from 'src/lib/logger';
import { ChunkGenerator } from './chunk-generator';
import { SessionData } from './session-data';
import { SourceData } from './source-data';
import { SoundSignature } from './types';

export interface SpeechGeneratorParams {
  sourceFilePath: string;
  soundSignature: SoundSignature;
}

export interface SpeechGeneratorDependencies {
  logger: Logger;
  chunkGenerator: ChunkGenerator;
  sourceData: SourceData;
  sessionData: SessionData;
}

export interface GenerateParams {
  chunksIndexes?: number[];
}

export class SpeechGenerator {
  private readonly logger: Logger;
  private readonly params: SpeechGeneratorParams;
  private readonly dependencies: SpeechGeneratorDependencies;

  constructor(params: SpeechGeneratorParams, dependencies: SpeechGeneratorDependencies) {
    this.logger = dependencies.logger.child({
      module: 'SpeechGenerator',
    });
    this.params = params;
    this.dependencies = dependencies;
  }

  async generate(params: GenerateParams) {
    return this.dependencies.chunkGenerator.generate({
      ...params,
      source: this.dependencies.sourceData.source,
    });
  }
}
