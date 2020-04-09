import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

import { Logger } from 'log4javascript';
import { LoggerFactory } from './app/shared/log/logger.factory';
import { Config } from './app/shared/config/config';

if (environment.production) {
  enableProdMode();
}

LoggerFactory.configure(Config);
const LOG: Logger = LoggerFactory.getLogger('root');
LOG.info('System loggers configured!!');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
