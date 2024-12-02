import config from 'config';
import { DeepgramClient } from './deepgram-client';
import { PlayhtClient } from './playht-client';
import { SpeechClientParams, SpeechProvider, SpeechProviders } from './speech-client-base';

interface SpeechProvidersConfig {
  deepgram: SpeechClientParams;
  playht: SpeechClientParams;
}

const speechProvidersConfig = config.get<SpeechProvidersConfig>('speechProviders');

export const getSpeechClient = (speechProvider: SpeechProvider) => {
  switch (speechProvider) {
    case SpeechProviders.Deepgram:
      return new DeepgramClient(speechProvidersConfig.deepgram);
    case SpeechProviders.Playht:
      return new PlayhtClient(speechProvidersConfig.playht);
  }
};
