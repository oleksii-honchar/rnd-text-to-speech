import * as PlayHT from 'playht';

import { AudioBuffer, getAudioBuffer } from 'src/lib/get-audio-buffer';
import {
  SpeechClientBase,
  SpeechClientGenerateParams,
  SpeechClientOptions,
  SpeechClientParams,
} from './speech-client-base';

export const PlayhtVoices = {
  Aurora:
    's3://voice-cloning-zero-shot/5b81dc4c-bf98-469d-96b4-8f09836fb500/aurorasaad/manifest.json',
  Autumn:
    's3://voice-cloning-zero-shot/ff414883-0e32-4a92-a688-d7875922120d/original/manifest.json',
} as const;

export const PlayhtVoiceEngines = {
  PlayHT2_0: 'PlayHT2.0',
  PlayHT3_0_Mini: 'Play3.0-mini',
} as const;

const defaultVoiceEngine = PlayhtVoiceEngines.PlayHT2_0;

export type PlayhtVoice = (typeof PlayhtVoices)[keyof typeof PlayhtVoices];
export type PlayhtVoiceEngine =
  (typeof PlayhtVoiceEngines)[keyof typeof PlayhtVoiceEngines];

export class PlayhtClient extends SpeechClientBase {
  override client: typeof PlayHT;

  constructor(params: SpeechClientParams, options: SpeechClientOptions) {
    super(params, options);

    PlayHT.init({
      apiKey: params.apiKey,
      userId: params.userId!,
      defaultVoiceId: PlayhtVoices.Autumn,
      defaultVoiceEngine,
    });
    this.client = PlayHT;
  }

  override async generate(params: SpeechClientGenerateParams): Promise<AudioBuffer> {
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
