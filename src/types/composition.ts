import { SpeechProvider } from 'src/modules/speech/speech-clients/speech-client-base';
import { SpeechVoice } from 'src/modules/speech/speech-clients/types';

export interface CompositionConfig {
  newLinePauseMilliSeconds: number;
}

export interface SoundSignature {
  speechProvider: SpeechProvider;
  voice: SpeechVoice;
  speed: number;
  composition: CompositionConfig;
}
