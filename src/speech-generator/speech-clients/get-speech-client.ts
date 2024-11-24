import config from 'config';
import { DeepgramClient } from './deepgram-client';
import { PlayhtClient } from './playht-client';
import {
  SpeechClientDependencies,
  SpeechClientParams,
  SpeechProvider,
  SpeechProviders,
} from './speech-client-base';

interface SpeechProvidersConfig {
  deepgram: SpeechClientParams;
  playht: SpeechClientParams;
}

const speechProviders = config.get<SpeechProvidersConfig>('speechProviders');

export const getSpeechClient = (service: SpeechProvider, dependencies: SpeechClientDependencies) => {
  switch (service) {
    case SpeechProviders.Deepgram:
      return new DeepgramClient(speechProviders.deepgram, dependencies);
    case SpeechProviders.Playht:
      return new PlayhtClient(speechProviders.playht, dependencies);
  }
};
