import { getLogger } from './lib/logger';
import speechGenerator, { SoundSignature } from './services/speech-generator';
import { PlayhtVoices } from './speech-clients/playht-client';
import { SpeechServices } from './speech-clients/speech-client-base';

const logger = getLogger();

logger.info('Starting app');
logger.info(`Working directory: '${process.cwd()}'`);

const test = () => { };

const soundSignature: SoundSignature = {
  speechService: SpeechServices.Playht,
  voice: PlayhtVoices.Nova,
  speed: 0.8,
};
// const soundSignature: SoundSignature = {
//   speechService: SpeechServices.Playht,
//   voice: PlayhtVoices.Autumn,
//   speed: 0.8,
// };

speechGenerator.init(
  {
    sourceFilePath: './sessions/#1-hypnotherapy-session/source.txt',
  },
  {
    soundSignature,
  },
);

(async () => {
  try {
    await speechGenerator.generate({ chunks: [0, 1, 2], soundSignature });
    await speechGenerator.glueChunks({ chunks: [0, 1, 2], soundSignature });
  } catch (error) {
    logger.error(error);
  }
})();
