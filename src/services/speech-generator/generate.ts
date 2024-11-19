import fs from 'fs';
import path from 'path';

import { AudioBuffer } from 'src/lib/get-audio-buffer';
import { getLogger } from 'src/lib/get-logger';
import { SpeechClientBase, SpeechService } from 'src/speech-clients/speech-client-base';
import { saveAudioToFile } from './save-audio-to-file';
import { SessionData } from './session-data';
import { SoundSignature } from './speech-generator';

const baseLogger = getLogger();

export interface GenerateParams {
  chunks?: number[];
  soundSignature: SoundSignature;
}

export interface GenerateOptions {
  outputDir: string;
  source: string[];
  sessionData: SessionData;
  speechClient: SpeechClientBase;
  speechService: SpeechService;
}

export const generate = async (
  { chunks = [], soundSignature }: GenerateParams,
  { outputDir, source, sessionData, speechClient, speechService }: GenerateOptions,
) => {
  const logger = baseLogger.child({
    method: 'generate',
  });
  logger.info(`Generating speech for chunks: ${chunks.join(', ')}`);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    logger.info(`Created output directory: ${outputDir}`);
  }

  if (chunks.length === 0) {
    chunks = source.map((_, idx) => idx);
  }

  for (const chunkIdx of chunks) {
    const chunkText = source[chunkIdx] || '';
    const chunkFilePath = path.join(
      outputDir,
      `chunk-${chunkIdx}_${soundSignature.voice.name}_${soundSignature.speed}.wav`,
    );

    baseLogger.info(`Chunk (${chunkIdx}): "${chunkText}"`);

    if (
      sessionData.isChunkExists({
        chunkText,
        voiceId: soundSignature.voice.voiceId,
        speed: soundSignature.speed,
        chunkFilePath,
        speechService: speechService,
      })
    ) {
      baseLogger.info(`Chunk (${chunkIdx}) already generated`);
      continue;
    }

    let buffer: AudioBuffer;
    try {
      buffer = await speechClient.generate({
        text: chunkText,
        voice: soundSignature.voice,
        speed: soundSignature.speed,
      });
    } catch (error) {
      baseLogger.error({ error }, `Error generating speech for chunk (${chunkIdx})`);
      continue;
    }

    await saveAudioToFile(buffer, chunkFilePath);

    sessionData.setChunkData({
      chunkText,
      chunkFilePath,
      voiceId: soundSignature.voice.voiceId,
      speed: soundSignature.speed,
      speechService: speechService,
    });

    baseLogger.info(`Generated speech for chunk (${chunkIdx})`);
  }
  sessionData.saveToFile();
};
