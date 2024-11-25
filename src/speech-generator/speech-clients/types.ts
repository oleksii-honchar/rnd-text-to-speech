export interface SpeechVoice {
  name: string;
  voiceId: string;
}

export type SpeechVoices = Record<string, SpeechVoice>;
