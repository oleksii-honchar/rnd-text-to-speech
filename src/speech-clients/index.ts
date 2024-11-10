import { DeepgramClient } from './deepgram-client';
import { PlayhtClient } from './playht-client';
import { SpeechClientOptions, SpeechService, SpeechServices } from './speech-client-base';

export const getSpeechClient = (service: SpeechService, options: SpeechClientOptions) => {
  switch (service) {
    case SpeechServices.Deepgram:
      return new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY || '' }, options);
    case SpeechServices.Playht:
      return new PlayhtClient(
        { apiKey: process.env.PLAYHT_API_KEY || '', userId: process.env.PLAYHT_USER_ID },
        options,
      );
  }
};
