import { Root } from 'mdast';

export interface Note {
  markdown: string;
  path: string;
  tree: Root;
}
