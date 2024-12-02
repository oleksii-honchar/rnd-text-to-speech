import { SpeechProvider } from 'src/vendor/speech-clients/speech-client-base';
import { SpeechVoice } from 'src/vendor/speech-clients/types';

export interface CompositionConfig {
  newLinePauseMilliSeconds: number;
}

export interface SoundSignature {
  speechService: SpeechProvider;
  voice: SpeechVoice;
  speed: number;
  composition: CompositionConfig;
}
