import { createClient } from '@deepgram/sdk';
import { Logger } from '@nestjs/common';

import { AudioBuffer, getAudioBuffer } from 'src/lib/get-audio-buffer';
import type { SpeechClientGenerateParams, SpeechClientParams } from './speech-client-base';
import { SpeechClientBase } from './speech-client-base';
import { SpeechVoices } from './types';

export const DeepgramVoices = {
  Athena: {
    name: 'athena',
    voiceId: 'aura-athena-en',
  },
} satisfies SpeechVoices;

export type DeepgramVoice = (typeof DeepgramVoices)[keyof typeof DeepgramVoices];

export class DeepgramClient extends SpeechClientBase {
  override readonly logger = new Logger(DeepgramClient.name);
  override client: DeepgramClient;

  constructor(params: SpeechClientParams) {
    super(params);
    this.client = createClient(params.apiKey) as unknown as DeepgramClient;
  }

  override async generate(params: SpeechClientGenerateParams): Promise<AudioBuffer> {
    // @ts-expect-error TS losts typing here
    const response = await this.client.speak.request(
      { text: params.text || '' },
      {
        model: params.voice.voiceId,
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
      this.logger.log({ headers }, 'Headers:');
    }

    return await getAudioBuffer(stream);
  }
}
