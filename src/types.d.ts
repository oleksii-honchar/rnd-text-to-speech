export type StringIndex = Record<string, unknown>;

export type SpeechVoice = {
  name: string;
  voiceId: string;
};

export type SpeechVoices = Record<string, SpeechVoice>;
