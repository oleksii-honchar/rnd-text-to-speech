import { logger } from './lib/logger';
import { getSpeechGenerator, PlayhtVoices, SoundSignature, SpeechProviders } from './speech-generator';

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
    await speechGenerator.assemble({ chunksIndexes: [0, 1, 2] });
  } catch (error) {
    logger.error(error);
  }
})();
