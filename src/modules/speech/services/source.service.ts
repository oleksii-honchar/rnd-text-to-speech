import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

@Injectable()
export class SourceService {
  private readonly logger = new Logger(SourceService.name);
  private sourceLines: string[] = [];

  initialize(sourceFilePath: string) {
    this.logger.log(`Loading source from '${sourceFilePath}'`);
    const fileContent = fs.readFileSync(path.join(process.cwd(), sourceFilePath), 'utf8');
    this.sourceLines = fileContent.split('\n').map(line => line.trim());
    this.logger.log(`Loaded (${this.sourceLines.length}) lines from source file`);
  }

  getSourceLines(): string[] {
    return this.sourceLines;
  }
}
