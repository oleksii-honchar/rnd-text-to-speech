import { Body, Controller, Post } from '@nestjs/common';
import { SpeechService } from './speech.service';

@Controller('speech')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @Post('generate')
  async generateSpeech(@Body() body: { sourceFilePath: string; chunksIndexes: number[] }) {
    return this.speechService.generateSpeech(body.sourceFilePath, body.chunksIndexes);
  }
}
