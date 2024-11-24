import fs from 'fs';
import path from 'path';

import { Logger } from 'src/lib/logger';

export interface SourceDataParams {
  sourceFilePath: string;
}

export interface SourceDataDependencies {
  logger: Logger;
}

export class SourceData {
  private readonly logger: Logger;
  private readonly params: SourceDataParams;
  source: string[];

  constructor(params: SourceDataParams, dependencies: SourceDataDependencies) {
    this.params = params;
    this.logger = dependencies.logger;
    this.source = [];

    this.loadSource();
  }

  loadSource() {
    const logger = this.logger.child({
      method: 'loadSource',
    });
    logger.info(`Loading source from '${this.params.sourceFilePath}'`);
    const fileContent = fs.readFileSync(path.join(process.cwd(), this.params.sourceFilePath), 'utf8');
    this.source = fileContent.split('\n').map(line => line.trim());
    logger.info(`Loaded (${this.source.length}) lines from source file`);
  }
}
