import { SpeechProvider } from './speech-clients/speech-client-base';
import { SpeechVoice } from './speech-clients/types';

export interface SoundSignature {
  speechService: SpeechProvider;
  voice: SpeechVoice;
  speed: number;
}
