export type NoteTemplate = {
  icon: string;
  file: string;
  title: string;
  description: string;
};

export type NoteTemplateWithContent = NoteTemplate & {
  content: string;
};
