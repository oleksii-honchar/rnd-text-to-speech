import { Logger } from '@nestjs/common';

import { AudioBuffer } from 'src/lib/get-audio-buffer';
import { SpeechVoice } from './types';

export const SpeechProviders = {
  Deepgram: 'deepgram',
  Playht: 'playht',
} as const;

export type SpeechProvider = (typeof SpeechProviders)[keyof typeof SpeechProviders];

export interface SpeechClientGenerateParams {
  text: string;
  voice: SpeechVoice;
  speed?: number;
}

export interface SpeechClientParams {
  apiKey: string;
  userId?: string;
}

export abstract class SpeechClientBase {
  readonly logger = new Logger(SpeechClientBase.name);
  protected params: SpeechClientParams;
  client: unknown;

  constructor(params: SpeechClientParams) {
    this.params = params;
  }

  abstract generate(params: SpeechClientGenerateParams): Promise<AudioBuffer>;
}
