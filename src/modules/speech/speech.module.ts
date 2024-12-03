import { Module } from '@nestjs/common';

import { SessionService } from 'src/modules/session/session.service';
import {
  ChunkGeneratorService,
  CompositionAssemblerService,
  SourceService,
  SpeechGeneratorService,
} from './services';
import { SpeechClientModule } from './speech-clients';
import { SpeechController } from './speech.controller';
import { compositionConfigProvider } from './speech.providers';
import { SpeechService } from './speech.service';

@Module({
  imports: [SpeechClientModule],
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
