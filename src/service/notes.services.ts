import { Injectable } from '@angular/core';
import {
  readDir,
  readTextFile,
  removeFile,
  writeTextFile,
} from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import { NO_TITLE, Note } from '../model/note.model';

import { unified } from 'unified';
import remarkParse from 'remark-parse';

import type { Heading, Text } from 'mdast';
import { sortBy } from 'lodash';

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
        const heading = this.extractHeading(content);

        results.push({ content, path, heading });
      } catch (error) {
        console.error(`Failed to read ${path}:`, error);
      }
    }

    return sortBy(results, 'heading');
  }

  async importFiles(directory: string): Promise<Note[]> {
    const paths = await this.readFilePathsRecursive(directory);
    return await this.readFiles(paths);
  }

  async saveFile(path: string, content: string): Promise<void> {
    return writeTextFile(path, content);
  }

  extractHeading(content: string): string {
    const tree = unified().use(remarkParse).parse(content);
    const headings = tree.children.filter(x => x.type === 'heading');

    if (headings.length === 0) {
      return NO_TITLE;
    }

    const text = (headings[0] as Heading).children.filter(
      x => x.type === 'text'
    );

    if (text.length === 0) {
      return NO_TITLE;
    }

    return (text[0] as Text).value;
  }

  async deleteFile(path: string): Promise<void> {
    await removeFile(path);
  }
}
