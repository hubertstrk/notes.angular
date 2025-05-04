import * as ace from 'ace-builds';

export type EditorChange = ace.Ace.Delta & { text: string };
