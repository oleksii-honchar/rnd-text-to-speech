import { logger } from './lib/logger';
import { getSpeechGenerator } from './speech-generator/get-speech-generator';

import { PlayhtVoices } from './speech-generator/speech-clients/playht-client';
import { SpeechProviders } from './speech-generator/speech-clients/speech-client-base';
import { SoundSignature } from './speech-generator/types';

logger.info('Starting app');
logger.info(`Working directory: '${process.cwd()}'`);

const soundSignature: SoundSignature = {
  speechService: SpeechProviders.Playht,
  voice: PlayhtVoices.Nova,
  speed: 0.8,
};
// const soundSignature: SoundSignature = {
//   speechService: SpeechServices.Playht,
//   voice: PlayhtVoices.Autumn,
//   speed: 0.8,
// };

const sourceFilePath = './sessions/#1-hypnotherapy-session/source.txt';

const speechGenerator = getSpeechGenerator({
  sourceFilePath,
  soundSignature,
});

(async () => {
  try {
    await speechGenerator.generate({ chunksIndexes: [0, 1, 2] });
    // await speechGenerator.glueChunks({ chunksIndexes: [0, 1, 2] });
  } catch (error) {
    logger.error(error);
  }
})();
