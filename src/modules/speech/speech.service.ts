import { Inject, Injectable } from '@nestjs/common';
import type { CompositionConfig, SoundSignature } from 'src/types';
import { PlayhtVoices, SpeechProviders } from 'src/vendor/speech-clients';
import { SpeechGeneratorService } from './services/speech-generator.service';
import { COMPOSITION_CONFIG } from './speech.providers';

@Injectable()
export class SpeechService {
  constructor(
    private readonly speechGenerator: SpeechGeneratorService,
    @Inject(COMPOSITION_CONFIG)
    private readonly compositionConfig: CompositionConfig,
  ) {}

  async generateSpeech(sourceFilePath: string, chunksIndexes: number[]) {
    const soundSignature: SoundSignature = {
      speechService: SpeechProviders.Playht,
      voice: PlayhtVoices.Nova,
      speed: 0.8,
      composition: this.compositionConfig,
    };

    this.speechGenerator.initialize(sourceFilePath, soundSignature);
    await this.speechGenerator.generate({ chunksIndexes });

    return { success: true };
  }
}
