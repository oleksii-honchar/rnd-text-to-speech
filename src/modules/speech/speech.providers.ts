import { Provider } from '@nestjs/common';
import config from 'config';

import { CompositionConfig } from 'src/types';

export const COMPOSITION_CONFIG = 'COMPOSITION_CONFIG';

export const compositionConfigProvider: Provider = {
  provide: COMPOSITION_CONFIG,
  useFactory: () => {
    return config.get<CompositionConfig>('composition');
  },
};
