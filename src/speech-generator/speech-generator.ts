import { Logger } from 'src/lib/logger';
import { ChunkGenerator, GenerateChunksParams } from './chunk-generator';
import { AssembleCompositionParams, CompositionAssembler } from './composition-assembler';
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
  compositionAssembler: CompositionAssembler;
  sourceData: SourceData;
  sessionData: SessionData;
}

export type GenerateParams = Pick<GenerateChunksParams, 'chunksIndexes'>;
export type AssembleParams = Pick<AssembleCompositionParams, 'chunksIndexes'>;

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
      sourceLines: this.dependencies.sourceData.sourceLines,
    });
  }

  async assemble(params: AssembleParams) {
    return this.dependencies.compositionAssembler.assemble({
      ...params,
      sourceLines: this.dependencies.sourceData.sourceLines,
    });
  }
}
