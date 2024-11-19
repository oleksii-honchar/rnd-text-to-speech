import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

import { getLogger } from 'src/lib/get-logger';
import { SessionData } from './session-data';
import { SoundSignature } from './speech-generator';

const baseLogger = getLogger();

export interface GlueChunksParams {
  chunks?: number[];
  soundSignature: SoundSignature;
}

export interface GlueChunksOptions {
  sessionData: SessionData;
  source: string[];
  outputDir: string;
}

export const glueChunks = async (
  { chunks = [], soundSignature }: GlueChunksParams,
  { outputDir, sessionData, source }: GlueChunksOptions,
) => {
  const logger = baseLogger.child({
    method: 'glueChunks',
  });

  if (chunks.length === 0) {
    chunks = source.map((_, idx) => idx);
  }

  logger.info({ chunks }, 'glueChunks');

  const chunkPaths: string[] = [];

  for (const chunkIdx of chunks) {
    const chunkFilePath = sessionData.getChunkFilePath(source[chunkIdx]!, soundSignature);
    if (!chunkFilePath) {
      throw new Error(`Chunk (${chunkIdx}) not found`);
    }

    chunkPaths.push(chunkFilePath);
  }

  const outputPath = path.join(outputDir, `session.wav`);

  logger.info('Concatenating audio chunks');
  await new Promise<string>((resolve, reject) => {
    const command = ffmpeg();

    chunkPaths.forEach(path => {
      command.input(path);
    });

    command
      .outputOptions(['-loglevel verbose', '-stats', '-progress pipe:1'])
      .on('start', commandLine => {
        logger.info({ commandLine }, 'FFmpeg process started');
      })
      .on('stderr', stderrLine => {
        logger.debug({ ffmpeg: stderrLine }, 'FFmpeg:');
      })
      .on('progress', progress => {
        logger.info(
          {
            percent: progress.percent?.toFixed(2),
            frames: progress.frames,
            fps: progress.currentFps,
            kbps: progress.currentKbps,
            time: progress.timemark,
          },
          'FFmpeg progress',
        );
      })
      .on('error', err => {
        logger.error({ error: err }, 'Failed to concatenate audio chunks');
        reject(new Error('Failed to concatenate audio chunks'));
      })
      .on('end', () => {
        resolve(outputPath);
      })
      .complexFilter([
        {
          filter: 'concat',
          options: {
            n: chunkPaths.length, // number of input files
            v: '0',
            a: '1',
          },
        },
      ])
      .output(outputPath)
      .run();
  });
  logger.info(`Audio chunks concatenated to '${outputPath}'`);
};
