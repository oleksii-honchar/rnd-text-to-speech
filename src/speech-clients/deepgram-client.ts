import { createClient } from '@deepgram/sdk';

import { AudioBuffer, getAudioBuffer } from 'src/lib/get-audio-buffer';
import {
  SpeechClientBase,
  SpeechClientGenerateParams,
  SpeechClientOptions,
  SpeechClientParams,
} from './speech-client-base';

export const DeepgramVoices = {
  Athena: 'aura-athena-en',
} as const;

export type DeepgramVoice = (typeof DeepgramVoices)[keyof typeof DeepgramVoices];

export class DeepgramClient extends SpeechClientBase {
  override client: DeepgramClient;

  constructor(params: SpeechClientParams, options: SpeechClientOptions) {
    super(params, options);
    this.client = createClient(params.apiKey) as unknown as DeepgramClient;
  }

  override async generate(params: SpeechClientGenerateParams): Promise<AudioBuffer> {
    // @ts-expect-error TS losts typing here
    const response = await this.client.speak.request(
      { text: params.text || '' },
      {
        model: params.voice as DeepgramVoice,
        encoding: 'linear16',
        container: 'wav',
      },
    );
    const stream = await response?.getStream();
    if (!stream) {
      this.logger.error('No stream returned from client');
      throw new Error('No stream returned from client');
    }

    const headers = await response?.getHeaders();
    if (headers) {
      this.logger.info({ headers }, 'Headers:');
    }

    return await getAudioBuffer(stream);
  }
}
