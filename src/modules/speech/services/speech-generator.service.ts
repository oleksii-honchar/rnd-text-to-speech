import { Injectable, Logger } from '@nestjs/common';
import path from 'path';

import { SessionService } from 'src/common/session.service';
import type { SoundSignature } from 'src/types';
import { ChunkGeneratorService } from './chunk-generator.service';
import { CompositionAssemblerService } from './composition-assembler.service';
import { SourceService } from './source.service';

export interface GenerateParams {
  chunksIndexes: number[];
}

export interface AssembleParams {
  chunksIndexes: number[];
}

@Injectable()
export class SpeechGeneratorService {
  private readonly logger = new Logger(SpeechGeneratorService.name);
  private sourceFilePath = '';
  private soundSignature!: SoundSignature;

  constructor(
    private readonly chunkGenerator: ChunkGeneratorService,
    private readonly compositionAssembler: CompositionAssemblerService,
    private readonly source: SourceService,
    private readonly session: SessionService,
  ) {}

  initialize(sourceFilePath: string, soundSignature: SoundSignature) {
    const sessionDirPath = path.dirname(path.join(process.cwd(), sourceFilePath));
    this.sourceFilePath = sourceFilePath;
    this.soundSignature = soundSignature;

    this.source.initialize(sourceFilePath);
    this.session.initialize({ sessionDirPath });
    this.chunkGenerator.initialize(sourceFilePath, soundSignature);
    this.compositionAssembler.initialize(sourceFilePath, soundSignature);
  }

  async generate(params: GenerateParams) {
    return this.chunkGenerator.generate({
      ...params,
      sourceLines: this.source.getSourceLines(),
    });
  }

  async assemble(params: AssembleParams) {
    return this.compositionAssembler.assemble({
      ...params,
      sourceLines: this.source.getSourceLines(),
    });
  }
}
