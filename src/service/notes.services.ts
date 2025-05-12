import { Injectable } from '@angular/core';
import { readDir, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import { Note } from '../model/note.model';

import { unified } from 'unified';
import remarkParse from 'remark-parse';

import type { Root } from 'mdast';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private async readFilePathsRecursive(directory: string): Promise<string[]> {
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

  private async readFiles(paths: string[]): Promise<Note[]> {
    const results: Note[] = [];

    for (const path of paths) {
      try {
        const content = await readTextFile(path);
        const tree: Root = unified().use(remarkParse).parse(content);

        results.push({ content: content, tree, path });
      } catch (error) {
        console.error(`Failed to read ${path}:`, error);
      }
    }

    return results;
  }

  async importFiles(directory: string): Promise<Note[]> {
    const paths = await this.readFilePathsRecursive(directory);
    const notes = await this.readFiles(paths);

    return notes;
  }

  async saveFile(path: string, content: string): Promise<void> {
    return writeTextFile(path, content);
  }
}
