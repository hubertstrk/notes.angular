import { Injectable } from '@angular/core';
import { readDir, readTextFile } from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import { Note } from '../model/note.model';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private async getMarkdownFilePathsRecursive(
    directory: string
  ): Promise<string[]> {
    const notePaths: string[] = [];

    async function walk(currentDir: string): Promise<void> {
      const entries = await readDir(currentDir, { recursive: false });

      for (const entry of entries) {
        if (entry.children && entry.name) {
          await walk(await join(currentDir, entry.name));
        } else if (entry.name && entry.name.endsWith('.md')) {
          notePaths.push(await join(currentDir, entry.name));
        }
      }
    }

    await walk(directory);

    return notePaths;
  }

  private async readMarkdownFiles(paths: string[]): Promise<Note[]> {
    const results: Note[] = [];

    for (const path of paths) {
      try {
        const content = await readTextFile(path);
        results.push({ markdown: content, path: path });
      } catch (error) {
        console.error(`Failed to read ${path}:`, error);
      }
    }

    return results;
  }

  async getMarkdownFiles(directory: string): Promise<Note[]> {
    const paths = await this.getMarkdownFilePathsRecursive(directory);
    const notes = await this.readMarkdownFiles(paths);
    return notes;
  }
}
