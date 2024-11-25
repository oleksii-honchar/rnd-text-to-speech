import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

import type { Logger } from 'src/lib/logger';
import { StringIndex } from 'src/types';
import { SessionData } from './session-data';
import { SoundSignature } from './types';

export interface CompositionAssemblerParams {
  outputDir: string;
}

export interface CompositionAssemblerDependencies {
  logger: Logger;
  sessionData: SessionData;
  soundSignature: SoundSignature;
}

export interface AssembleCompositionParams {
  chunksIndexes: number[];
  sourceLines: string[];
}

export class CompositionAssembler {
  constructor(
    private readonly params: CompositionAssemblerParams,
    private readonly dependencies: CompositionAssemblerDependencies,
  ) {}

  async assemble(params: AssembleCompositionParams): Promise<void> {
    const logger = this.dependencies.logger.child({
      method: 'assemble',
    });

    const { sessionData, soundSignature } = this.dependencies;
    const { sourceLines } = params;
    let { chunksIndexes } = params;

    if (chunksIndexes.length === 0) {
      chunksIndexes = sourceLines.map((_, idx) => idx);
    }

    logger.info({ chunksIndexes }, 'assemble composition for chunks');
    const chunkPaths: string[] = [];

    for (const chunkIdx of chunksIndexes) {
      const chunkFilePath = sessionData.getChunkFilePath(sourceLines[chunkIdx]!, soundSignature);
      if (!chunkFilePath) {
        throw new Error(`Chunk (${chunkIdx}) not found`);
      }

      chunkPaths.push(chunkFilePath);
    }

    if (!fs.existsSync(this.params.outputDir)) {
      fs.mkdirSync(this.params.outputDir, { recursive: true });
      logger.info(`Created output directory: ${this.params.outputDir}`);
    }
    const outputPath = path.join(
      this.params.outputDir,
      `composition-${soundSignature.voice.name}-${soundSignature.speed}.wav`,
    );
    logger.info('Concatenating audio chunks');
    return this.executeCommand(chunkPaths, outputPath);
  }

  executeCommand(chunkPaths: string[], outputPath: string): Promise<void> {
    const logger = this.dependencies.logger.child({
      method: 'executeCommand',
    });

    return new Promise<void>((resolve, reject) => {
      const command = ffmpeg();

      chunkPaths.forEach(path => {
        command.input(path);
      });

      command
        .outputOptions(['-loglevel verbose', '-stats', '-progress pipe:1'])
        .on('start', (commandLine: string) => {
          logger.info({ commandLine }, 'FFmpeg process started');
        })
        .on('stderr', (stderrLine: string) => {
          logger.debug({ ffmpeg: stderrLine }, 'FFmpeg:');
        })
        .on('progress', (progress: StringIndex) => {
          logger.info(
            {
              // @ts-expect-error covering ffmpeg types
              percent: progress.percent?.toFixed(2),
              frames: progress.frames,
              fps: progress.currentFps,
              kbps: progress.currentKbps,
              time: progress.timemark,
            },
            'FFmpeg progress',
          );
        })
        .on('error', (err: Error) => {
          logger.error({ error: err }, 'Failed to concatenate audio chunks');
          reject(new Error('Failed to concatenate audio chunks'));
        })
        .on('end', () => {
          logger.info(`Audio chunks concatenated to '${outputPath}'`);
          resolve();
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
  }
}
