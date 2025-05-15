import { Injectable } from '@angular/core';
import { Settings } from '../app/model/settings.model';
import {
  writeTextFile,
  readTextFile,
  BaseDirectory,
  createDir,
  readDir,
} from '@tauri-apps/api/fs';

const SETTINGS_DIR = 'notes-app';
const SETTINGS_FILE = 'user-settings.json';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  async readSettings(): Promise<Settings> {
    await createDir(SETTINGS_DIR, {
      dir: BaseDirectory.AppData,
      recursive: true,
    });
    const path = `${SETTINGS_DIR}/${SETTINGS_FILE}`;
    let content = '';
    try {
      console.info('Reading settings from', BaseDirectory.AppData);
      content = await readTextFile(path, { dir: BaseDirectory.AppData });
    } catch {
      content = JSON.stringify({ basePath: '' });
      await writeTextFile(path, content, { dir: BaseDirectory.AppData });
    }
    return JSON.parse(content);
  }

  async saveSettings(settings: Settings): Promise<void> {
    await createDir(SETTINGS_DIR, {
      dir: BaseDirectory.AppData,
      recursive: true,
    });
    const path = `${SETTINGS_DIR}/${SETTINGS_FILE}`;
    console.info('Saving settings in', BaseDirectory.AppData);
    const content = JSON.stringify(settings);
    await writeTextFile(path, content, { dir: BaseDirectory.AppData });
  }

  async directoryExists(path: string): Promise<boolean> {
    try {
      await readDir(path);
      return true;
    } catch {
      return false;
    }
  }
}
