import { Logger } from 'pino';
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

export interface SpeechClientDependencies {
  logger: Logger;
}

export abstract class SpeechClientBase {
  protected logger: Logger;
  protected params: SpeechClientParams;
  protected dependencies: SpeechClientDependencies;
  client: unknown;

  constructor(params: SpeechClientParams, dependencies: SpeechClientDependencies) {
    this.params = params;
    this.dependencies = dependencies;
    this.logger = dependencies.logger;
  }

  abstract generate(params: SpeechClientGenerateParams): Promise<AudioBuffer>;
}
