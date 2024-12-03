import { Provider } from '@nestjs/common';
import config from 'config';

import { SpeechProvidersConfig } from './types';

export const SPEECH_CLIENT_CONFIG = 'SPEECH_CLIENT_CONFIG';

export const speechClientConfigProvider: Provider = {
  provide: SPEECH_CLIENT_CONFIG,
  useFactory: () => {
    return config.get<SpeechProvidersConfig>('speechProviders');
  },
};
