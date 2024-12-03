import { Injectable, Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

import { SessionService } from 'src/modules/session';
import { SoundSignature, StringIndex } from 'src/types';

export interface AssembleCompositionParams {
  chunksIndexes: number[];
  sourceLines: string[];
}

@Injectable()
export class CompositionAssemblerService {
  private readonly logger = new Logger(CompositionAssemblerService.name);
  private outputDir = '';
  private soundSignature!: SoundSignature;

  constructor(private readonly session: SessionService) {}

  initialize(sourceFilePath: string, soundSignature: SoundSignature) {
    const sessionDirPath = path.dirname(path.join(process.cwd(), sourceFilePath));
    this.outputDir = path.join(sessionDirPath, 'compositions');
    this.soundSignature = soundSignature;
  }

  async assemble(params: AssembleCompositionParams): Promise<void> {
    const { sourceLines } = params;
    let { chunksIndexes } = params;

    if (chunksIndexes.length === 0) {
      chunksIndexes = sourceLines.map((_, idx) => idx);
    }

    this.logger.log({ chunksIndexes }, 'assemble composition for chunks');
    const chunkPaths: string[] = [];

    for (const chunkIdx of chunksIndexes) {
      const chunkFilePath = this.session.getChunkFilePath(sourceLines[chunkIdx]!, this.soundSignature);
      if (!chunkFilePath) {
        throw new Error(`Chunk (${chunkIdx}) not found`);
      }

      chunkPaths.push(chunkFilePath);
    }

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      this.logger.log(`Created output directory: ${this.outputDir}`);
    }

    const outputPath = path.join(
      this.outputDir,
      `composition-${this.soundSignature.voice.name}-${this.soundSignature.speed}.wav`,
    );
    this.logger.log('Concatenating audio chunks');
    return this.executeCommand(chunkPaths, outputPath);
  }

  private executeCommand(chunkPaths: string[], outputPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const command = ffmpeg();

      chunkPaths.forEach(path => {
        command.input(path);
      });

      command
        .outputOptions(['-loglevel verbose', '-stats', '-progress pipe:1'])
        .on('start', (commandLine: string) => {
          this.logger.log({ commandLine }, 'FFmpeg process started');
        })
        .on('stderr', (stderrLine: string) => {
          this.logger.debug({ ffmpeg: stderrLine }, 'FFmpeg:');
        })
        .on('progress', (progress: StringIndex) => {
          this.logger.log(
            {
              // @ts-expect-error TS losts typing here
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
          this.logger.error({ error: err }, 'Failed to concatenate audio chunks');
          reject(new Error('Failed to concatenate audio chunks'));
        })
        .on('end', () => {
          this.logger.log(`Audio chunks concatenated to '${outputPath}'`);
          resolve();
        })
        .complexFilter([
          {
            filter: 'concat',
            options: {
              n: chunkPaths.length,
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
