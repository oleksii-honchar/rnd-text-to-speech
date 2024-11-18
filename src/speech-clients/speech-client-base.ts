import { Logger } from 'pino';
import { SpeechVoice } from 'src/types';
import { AudioBuffer } from '../lib/get-audio-buffer';

export const SpeechServices = {
  Deepgram: 'deepgram',
  Playht: 'playht',
} as const;

export type SpeechService = (typeof SpeechServices)[keyof typeof SpeechServices];

export interface SpeechClientGenerateParams {
  text: string;
  voice: SpeechVoice;
  speed?: number;
}

export interface SpeechClientParams {
  apiKey: string;
  userId?: string;
}

export interface SpeechClientOptions {
  logger: Logger;
}

export abstract class SpeechClientBase {
  protected logger: Logger;
  protected params: SpeechClientParams;
  protected options: SpeechClientOptions;
  client: unknown;

  constructor(params: SpeechClientParams, options: SpeechClientOptions) {
    this.params = params;
    this.options = options;
    this.logger = options.logger;
  }

  abstract generate(params: SpeechClientGenerateParams): Promise<AudioBuffer>;
}
