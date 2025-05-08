import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

interface MonacoEnvironment {
  getWorkerUrl: (moduleId: string, label: string) => string;
}

(
  window as unknown as { MonacoEnvironment: MonacoEnvironment }
).MonacoEnvironment = {
  getWorkerUrl: (_moduleId: string, label: string): string => {
    switch (label) {
      case 'json':
        return './assets/monaco/json.worker.js';
      case 'css':
      case 'scss':
      case 'less':
        return './assets/monaco/css.worker.js';
      case 'html':
      case 'handlebars':
      case 'razor':
        return './assets/monaco/html.worker.js';
      case 'typescript':
      case 'javascript':
        return './assets/monaco/ts.worker.js';
      default:
        return './assets/monaco/editor.worker.js';
    }
  },
};

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
