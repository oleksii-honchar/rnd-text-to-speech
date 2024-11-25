import fs from 'fs';
import path from 'path';

import { Logger } from 'src/lib/logger';
import { SessionData } from './session-data';
import { SoundSignature } from './types';

import { AudioBuffer } from 'src/lib/get-audio-buffer';
import { SpeechClientBase } from './speech-clients';

export interface GenerateChunksParams {
  chunksIndexes: number[];
  sourceLines: string[];
}

export interface ChunkGeneratorParams {
  outputDir: string;
  soundSignature: SoundSignature;
}

export interface ChunkGeneratorDependencies {
  logger: Logger;
  sessionData: SessionData;
  speechClient: SpeechClientBase;
}

export class ChunkGenerator {
  private readonly logger: Logger;
  private readonly params: ChunkGeneratorParams;
  private readonly dependencies: ChunkGeneratorDependencies;

  constructor(params: ChunkGeneratorParams, dependencies: ChunkGeneratorDependencies) {
    this.logger = dependencies.logger.child({
      module: 'ChunkGenerator',
    });
    this.params = params;
    this.dependencies = dependencies;
  }

  async generate({ chunksIndexes = [], sourceLines }: GenerateChunksParams) {
    const logger = this.logger.child({
      method: 'generate',
    });
    logger.info(`Generating speech for chunks: ${chunksIndexes.join(', ')}`);
    if (!fs.existsSync(this.params.outputDir)) {
      fs.mkdirSync(this.params.outputDir, { recursive: true });
      logger.info(`Created output directory: ${this.params.outputDir}`);
    }

    if (chunksIndexes.length === 0) {
      chunksIndexes = sourceLines.map((_, idx) => idx);
    }

    for (const chunkIdx of chunksIndexes) {
      const chunkText = sourceLines[chunkIdx] ?? '';
      const chunkFilePath = path.join(
        this.params.outputDir,
        `chunk-${chunkIdx}_${this.params.soundSignature.voice.name}_${this.params.soundSignature.speed}.wav`,
      );

      logger.info(`Chunk (${chunkIdx}): "${chunkText}"`);

      if (
        this.dependencies.sessionData.isChunkExists({
          chunkText,
          voiceId: this.params.soundSignature.voice.voiceId,
          speed: this.params.soundSignature.speed,
          chunkFilePath,
          speechService: this.params.soundSignature.speechService,
        })
      ) {
        logger.info(`Chunk (${chunkIdx}) already generated`);
        continue;
      }

      let buffer: AudioBuffer;
      try {
        buffer = await this.dependencies.speechClient.generate({
          text: chunkText,
          voice: this.params.soundSignature.voice,
          speed: this.params.soundSignature.speed,
        });
      } catch (error) {
        logger.error({ error }, `Error generating speech for chunk (${chunkIdx})`);
        continue;
      }

      await this.saveAudioToFile(buffer, chunkFilePath);

      this.dependencies.sessionData.setChunkData({
        chunkText,
        chunkFilePath,
        voiceId: this.params.soundSignature.voice.voiceId,
        speed: this.params.soundSignature.speed,
        speechService: this.params.soundSignature.speechService,
      });

      logger.info(`Generated speech for chunk (${chunkIdx})`);
    }
    this.dependencies.sessionData.saveToFile();
  }

  async saveAudioToFile(buffer: AudioBuffer, outputPath: string) {
    const logger = this.logger.child({
      method: 'saveToFile',
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
  }
}
