import { appDataDir } from '@tauri-apps/api/path';
import {
  exists,
  createDir,
  writeTextFile,
  BaseDirectory,
} from '@tauri-apps/api/fs';

export async function initSettingsFactory() {
  // ensure app directory
  const appDataPath = await appDataDir();
  const appDataExists = await exists(appDataPath, {
    dir: BaseDirectory.AppData,
  });

  if (!appDataExists) {
    await createDir(appDataPath);
    console.info('app initialize: created app data directory');
  }

  // ensure user settings
  const doSettingsExist = await exists('notes-settings.json', {
    dir: BaseDirectory.AppConfig,
  });
  if (!doSettingsExist) {
    await writeTextFile(
      { path: 'notes-settings.json', contents: '{}' },
      { dir: BaseDirectory.AppConfig }
    );
    console.info('app initialize: created user settings');
  }
}
