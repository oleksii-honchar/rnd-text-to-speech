import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

import { AudioBuffer } from 'src/lib/get-audio-buffer';
import { SessionService } from 'src/modules/session';
import { SpeechClientBase, SpeechClientService } from 'src/modules/speech/speech-clients';
import { SoundSignature } from 'src/types';

export interface GenerateChunksParams {
  chunksIndexes: number[];
  sourceLines: string[];
}

@Injectable()
export class ChunkGeneratorService {
  private readonly logger = new Logger(ChunkGeneratorService.name);
  private outputDir = '';
  private soundSignature!: SoundSignature;
  private speechClient!: SpeechClientBase;
  private speechClientService: SpeechClientService;

  constructor(
    private readonly session: SessionService,
    speechClientService: SpeechClientService,
  ) {
    this.speechClientService = speechClientService;
  }

  async initialize(sourceFilePath: string, soundSignature: SoundSignature) {
    const sessionDirPath = path.dirname(path.join(process.cwd(), sourceFilePath));
    this.outputDir = path.join(sessionDirPath, 'chunks');
    this.soundSignature = soundSignature;

    this.speechClientService.initialize(soundSignature.speechProvider);

    if (!this.speechClient) {
      throw new Error(`Failed to initialize speech client for service: ${soundSignature.speechProvider}`);
    }
  }

  async generate({ chunksIndexes = [], sourceLines }: GenerateChunksParams) {
    this.logger.log(`Generating speech for chunks: ${chunksIndexes.join(', ')}`);

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      this.logger.log(`Created output directory: ${this.outputDir}`);
    }

    if (chunksIndexes.length === 0) {
      chunksIndexes = sourceLines.map((_, idx) => idx);
    }

    for (const chunkIdx of chunksIndexes) {
      const chunkText = sourceLines[chunkIdx] ?? '';
      const chunkFilePath = path.join(
        this.outputDir,
        `chunk-${chunkIdx}_${this.soundSignature.voice.name}_${this.soundSignature.speed}.wav`,
      );

      this.logger.log(`Chunk (${chunkIdx}): "${chunkText}"`);

      if (
        this.session.isChunkExists({
          chunkText,
          voiceId: this.soundSignature.voice.voiceId,
          speed: this.soundSignature.speed,
          chunkFilePath,
          speechService: this.soundSignature.speechProvider,
        })
      ) {
        this.logger.log(`Chunk (${chunkIdx}) already generated`);
        continue;
      }

      let buffer: AudioBuffer;
      try {
        buffer = await this.speechClient.generate({
          text: chunkText,
          voice: this.soundSignature.voice,
          speed: this.soundSignature.speed,
        });
      } catch (error) {
        this.logger.error(`Error generating speech for chunk (${chunkIdx})`, error);
        continue;
      }

      await this.saveAudioToFile(buffer, chunkFilePath);

      this.session.setChunkData({
        chunkText,
        chunkFilePath,
        voiceId: this.soundSignature.voice.voiceId,
        speed: this.soundSignature.speed,
        speechService: this.soundSignature.speechProvider,
      });

      this.logger.log(`Generated speech for chunk (${chunkIdx})`);
    }
    this.session.saveToFile();
  }

  private async saveAudioToFile(buffer: AudioBuffer, outputPath: string) {
    this.logger.log(`Saving to file: ${outputPath}`);
    fs.writeFile(outputPath, buffer, err => {
      if (err) {
        this.logger.error('Error writing audio to file:', err);
      } else {
        this.logger.log(`Audio file written to: ${outputPath}`);
      }
    });
    this.logger.log('Done');
  }
}
