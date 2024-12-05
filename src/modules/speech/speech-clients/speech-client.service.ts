import { Inject, Injectable } from '@nestjs/common';

import { SpeechClientBase, SpeechProvider, SpeechProviders } from './speech-client-base';
import { SPEECH_CLIENT_CONFIG } from './speech-client.provider';
import { DeepgramClient } from './speech-deepgram-client';
import { PlayhtClient } from './speech-playai-client';
import type { SpeechProvidersConfig } from './types';

@Injectable()
export class SpeechClientService {
  private speechClient!: SpeechClientBase;

  constructor(
    @Inject(SPEECH_CLIENT_CONFIG)
    private readonly speechProvidersConfig: SpeechProvidersConfig,
  ) {}

  async initialize(speechProvider: SpeechProvider) {
    switch (speechProvider) {
      case SpeechProviders.Deepgram:
        this.speechClient = new DeepgramClient(this.speechProvidersConfig.deepgram);
        break;
      case SpeechProviders.Playht:
        this.speechClient = new PlayhtClient(this.speechProvidersConfig.playht);
        break;
    }
  }
}
