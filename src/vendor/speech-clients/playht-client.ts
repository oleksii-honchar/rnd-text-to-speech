import { Logger } from '@nestjs/common';
import * as PlayHT from 'playht';

import { AudioBuffer, getAudioBuffer } from 'src/lib/get-audio-buffer';
import { SpeechClientBase, SpeechClientGenerateParams, SpeechClientParams } from './speech-client-base';
import { SpeechVoices } from './types';

export const PlayhtVoices = {
  Aurora: {
    name: 'aurora',
    voiceId: 's3://voice-cloning-zero-shot/5b81dc4c-bf98-469d-96b4-8f09836fb500/aurorasaad/manifest.json',
  },
  Autumn: {
    name: 'autumn',
    voiceId: 's3://voice-cloning-zero-shot/ff414883-0e32-4a92-a688-d7875922120d/original/manifest.json',
  },
  Nova: {
    name: 'nova',
    voiceId: 's3://voice-cloning-zero-shot/2a7ddfc5-d16a-423a-9441-5b13290998b8/novasaad/manifest.json',
  },
} satisfies SpeechVoices;

export const PlayhtVoiceEngines = {
  PlayHT2_0: 'PlayHT2.0',
  PlayHT3_0_Mini: 'Play3.0-mini',
} as const;

const defaultVoiceEngine = PlayhtVoiceEngines.PlayHT2_0;

export type PlayhtVoice = (typeof PlayhtVoices)[keyof typeof PlayhtVoices];
export type PlayhtVoiceEngine = (typeof PlayhtVoiceEngines)[keyof typeof PlayhtVoiceEngines];

export class PlayhtClient extends SpeechClientBase {
  override readonly logger = new Logger(PlayhtClient.name);
  override client: typeof PlayHT;

  constructor(params: SpeechClientParams) {
    super(params);
    PlayHT.init({
      apiKey: this.params.apiKey,
      userId: this.params.userId!,
      defaultVoiceId: PlayhtVoices.Autumn.voiceId,
      defaultVoiceEngine,
    });
    this.client = PlayHT;
  }

  override async generate(params: SpeechClientGenerateParams): Promise<AudioBuffer> {
    PlayHT.init({
      apiKey: this.params.apiKey,
      userId: this.params.userId!,
      defaultVoiceId: params.voice.voiceId,
      defaultVoiceEngine,
    });
    this.client = PlayHT;

    const response = await this.client.generate(params.text || '', {
      speed: params.speed,
      voiceEngine: defaultVoiceEngine,
    });
    const { audioUrl } = response;
    const streamResponse = await fetch(audioUrl);
    if (!streamResponse.ok) {
      this.logger.error(`Failed to fetch audio: ${streamResponse.statusText}`);
      throw new Error(`Failed to fetch audio: ${streamResponse.statusText}`);
    }

    return await getAudioBuffer(streamResponse.body as ReadableStream<Uint8Array>);
  }
}
