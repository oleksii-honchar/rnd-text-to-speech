import fs from 'fs';

import { AudioBuffer } from 'src/lib/get-audio-buffer';
import { getLogger } from 'src/lib/get-logger';

const baseLogger = getLogger();

export const saveAudioToFile = async (buffer: AudioBuffer, outputPath: string) => {
  const logger = baseLogger.child({
    method: 'saveAudioToFile',
  });
  logger.info(`Saving to file: ${outputPath}`);
  fs.writeFile(outputPath, buffer, err => {
    if (err) {
      logger.error({ err }, 'Error writing audio to file:');
    } else {
      logger.info(`Audio file written to: ${outputPath}`);
    }
  });
  logger.info('Done');
};
