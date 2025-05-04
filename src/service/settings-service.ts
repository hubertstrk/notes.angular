import { Injectable } from '@angular/core';
import { Settings } from '../model/settings.model';
import { writeTextFile, readTextFile, BaseDirectory } from '@tauri-apps/api/fs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settingsFileName = 'notes-settings.json';

  async readSettings(): Promise<Settings> {
    const settings = await readTextFile(this.settingsFileName, {
      dir: BaseDirectory.AppConfig,
    });

    return JSON.parse(settings);
  }

  async writeSettings(settings: Settings) {
    await writeTextFile(
      { path: this.settingsFileName, contents: JSON.stringify(settings) },
      { dir: BaseDirectory.AppConfig }
    );
  }
}
