import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

import { SpeechProvider } from 'src/modules/speech/speech-clients';
import type { SoundSignature } from 'src/types';

export interface SessionDataParams {
  sessionDirPath: string;
}

export interface Chunk {
  chunkText: string;
  chunkFilePath: string;
  speed: number;
  speechService: SpeechProvider;
  voiceId: string;
}

export interface SessionData {
  chunks: Chunk[];
}

@Injectable()
export class SessionService {
  private sessionFilePath: string;
  private session: SessionData;

  constructor() {
    this.sessionFilePath = '';
    this.session = {
      chunks: [],
    };
  }

  initialize(params: SessionDataParams) {
    this.sessionFilePath = path.join(params.sessionDirPath, 'session.json');
    this.loadFromFile();
  }

  private loadFromFile() {
    const content = fs.readFileSync(this.sessionFilePath, 'utf8');
    this.session = JSON.parse(content);
  }

  saveToFile() {
    fs.writeFileSync(this.sessionFilePath, JSON.stringify(this.session, null, 2));
  }

  setChunkData(chunkData: Chunk) {
    this.session.chunks = this.session.chunks || [];
    this.session.chunks.push(chunkData);
  }

  isChunkExists(chunk: Chunk): boolean {
    return this.session.chunks.some(c =>
      Object.entries(chunk).every(([key, value]) => c[key as keyof Chunk] === value),
    );
  }

  getChunkFilePath(chunkText: string, soundSignature: SoundSignature): string | undefined {
    return this.session.chunks.find(
      c =>
        c.chunkText === chunkText &&
        c.speechService === soundSignature.speechProvider &&
        c.voiceId === soundSignature.voice.voiceId &&
        c.speed === soundSignature.speed,
    )?.chunkFilePath;
  }
}
