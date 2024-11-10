import fs from 'fs';
import path from 'path';

import { Logger } from 'pino';
import { AudioBuffer } from './lib/get-audio-buffer';
import { getSpeechClient } from './speech-clients';
import { SpeechClientBase, SpeechService } from './speech-clients/speech-client-base';

export interface SpeechGeneratorParams {
  sourceFilePath: string;
}

export interface SpeechGeneratorOptions {
  logger: Logger;
  speechService: SpeechService;
}

export interface GenerateParams {
  chunks?: number[];
  voice: string;
  speed?: number;
}

export class SpeechGenerator {
  private logger: Logger;
  private params: SpeechGeneratorParams;
  private options: SpeechGeneratorOptions;
  private source: string[] = [];
  private outputDir = '';
  private speechClient: SpeechClientBase;

  constructor(params: SpeechGeneratorParams, options: SpeechGeneratorOptions) {
    this.logger = options.logger.child({
      module: 'SpeechGenerator',
    });
    this.params = params;
    this.options = options;

    const client = getSpeechClient(this.options.speechService, {
      logger: this.logger,
    });
    if (!client) {
      throw new Error(
        `Failed to initialize speech client for service: ${this.options.speechService}`,
      );
    }
    this.speechClient = client;

    this.outputDir = path.dirname(path.join(process.cwd(), this.params.sourceFilePath));
    this.outputDir = path.join(this.outputDir, 'chunks');

    this.loadSource();
  }

  loadSource() {
    this.logger.info(`Loading source from '${this.params.sourceFilePath}'`);
    const fileContent = fs.readFileSync(
      path.join(process.cwd(), this.params.sourceFilePath),
      'utf8',
    );
    this.source = fileContent.split('\n').map(line => line.trim());
    this.logger.info(`Loaded (${this.source.length}) lines from source file`);
  }

  async generate({ chunks = [], voice, speed = 1 }: GenerateParams) {
    const logger = this.logger.child({
      method: 'generate',
    });
    logger.info(`Generating speech for chunks: ${chunks.join(', ')}`);
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      logger.info(`Created output directory: ${this.outputDir}`);
    }

    for (const chunkIdx of chunks) {
      const chunkText = this.source[chunkIdx];
      logger.info(`Chunk (${chunkIdx}): "${chunkText}"`);

      let buffer: AudioBuffer;
      try {
        buffer = await this.speechClient.generate({
          text: chunkText || '',
          voice,
          speed,
        });
      } catch (error) {
        logger.error({ error }, `Error generating speech for chunk (${chunkIdx})`);
        continue;
      }

      const chunkFilePath = path.join(this.outputDir, `chunk-${chunkIdx}.wav`);
      await this.saveToFile(buffer, chunkFilePath);

      logger.info(`Generated speech for chunk (${chunkIdx})`);
    }
  }

  async saveToFile(buffer: AudioBuffer, outputPath: string) {
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
