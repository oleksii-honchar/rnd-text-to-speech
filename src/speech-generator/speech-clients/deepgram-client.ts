import { createClient } from '@deepgram/sdk';

import { AudioBuffer, getAudioBuffer } from 'src/lib/get-audio-buffer';
import {
  SpeechClientBase,
  SpeechClientDependencies,
  SpeechClientGenerateParams,
  SpeechClientParams,
} from './speech-client-base';
import { SpeechVoices } from './types';

export const DeepgramVoices = {
  Athena: {
    name: 'athena',
    voiceId: 'aura-athena-en',
  },
} satisfies SpeechVoices;

export type DeepgramVoice = (typeof DeepgramVoices)[keyof typeof DeepgramVoices];

export class DeepgramClient extends SpeechClientBase {
  override client: DeepgramClient;

  constructor(params: SpeechClientParams, dependencies: SpeechClientDependencies) {
    super(params, dependencies);
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
      this.logger.info({ headers }, 'Headers:');
    }

    return await getAudioBuffer(stream);
  }
}
