import { Injectable } from '@angular/core';
import { Settings } from '@models/settings.model';
import {
  BaseDirectory,
  readTextFile,
  writeTextFile,
} from '@tauri-apps/plugin-fs';

import { SettingsFileName } from '@models/settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  async readSettings(): Promise<Settings> {
    try {
      const settings = await readTextFile(SettingsFileName, {
        baseDir: BaseDirectory.AppData,
      });
      return JSON.parse(settings);
    } catch (error) {
      console.error(`Failed to read ${SettingsFileName}:`, error);
      return Promise.reject(error);
    }
  }

  async saveSettings(settings: Settings): Promise<void> {
    try {
      return await writeTextFile(SettingsFileName, JSON.stringify(settings), {
        baseDir: BaseDirectory.AppData,
      });
    } catch (error) {
      console.error(`Failed to save ${SettingsFileName}:`, error);
      return Promise.reject(error);
    }
  }
}
