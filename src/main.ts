import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => {
    console.error("ERRO NO BOOTSTRAP:");
    console.dir(err); // O console.dir mostra as propriedades internas do erro
  });
