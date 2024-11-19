import fs from 'fs';
import path from 'path';

import { SpeechService } from 'src/speech-clients/speech-client-base';
import { SoundSignature } from './speech-generator';

export interface SessionDataParams {
  sessionDirPath: string;
}

export interface Chunk {
  chunkText: string;
  chunkFilePath: string;
  speed: number;
  speechService: SpeechService;
  voiceId: string;
}

export interface Session {
  chunks: Chunk[];
}

export class SessionData {
  private params: SessionDataParams;
  private sessionFilePath: string;
  private session: Session;

  constructor(params: SessionDataParams) {
    this.params = params;
    this.sessionFilePath = path.join(this.params.sessionDirPath, 'session.json');
    this.session = {
      chunks: [],
    };

    this.loadFromFile();
  }

  loadFromFile() {
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

  isChunkExists(chunk: Chunk) {
    return this.session.chunks.some(c =>
      Object.entries(chunk).every(([key, value]) => c[key as keyof Chunk] === value),
    );
  }

  getChunkFilePath(chunkText: string, soundSignature: SoundSignature) {
    return this.session.chunks.find(
      c =>
        c.chunkText === chunkText &&
        c.speechService === soundSignature.speechService &&
        c.voiceId === soundSignature.voice.voiceId &&
        c.speed === soundSignature.speed,
    )?.chunkFilePath;
  }
}
