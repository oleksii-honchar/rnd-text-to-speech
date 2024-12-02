import { Module } from '@nestjs/common';
import { SpeechModule } from './modules/speech/speech.module';

@Module({
  imports: [SpeechModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
