import { Module } from '@nestjs/common';

import { speechClientConfigProvider } from './speech-client.provider';
import { SpeechClientService } from './speech-client.service';

@Module({
  providers: [SpeechClientService, speechClientConfigProvider],
  exports: [SpeechClientService],
})
export class SpeechClientModule {}
