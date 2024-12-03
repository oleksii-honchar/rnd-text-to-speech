import { SpeechClientParams } from './speech-client-base';

export interface SpeechVoice {
  name: string;
  voiceId: string;
}

export type SpeechVoices = Record<string, SpeechVoice>;

export interface SpeechProvidersConfig {
  deepgram: SpeechClientParams;
  playht: SpeechClientParams;
}
