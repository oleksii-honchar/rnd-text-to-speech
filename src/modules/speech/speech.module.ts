import { Module } from '@nestjs/common';

import { SessionService } from 'src/common/session.service';
import {
  ChunkGeneratorService,
  CompositionAssemblerService,
  SourceService,
  SpeechGeneratorService,
} from './services';
import { SpeechController } from './speech.controller';
import { compositionConfigProvider } from './speech.providers';
import { SpeechService } from './speech.service';

@Module({
  controllers: [SpeechController],
  providers: [
    ChunkGeneratorService,
    CompositionAssemblerService,
    SessionService,
    SourceService,
    SpeechGeneratorService,
    SpeechService,
    compositionConfigProvider,
  ],
})
export class SpeechModule {}
