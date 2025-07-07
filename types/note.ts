export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: Tag;
}

export interface NewNote {
  title: string;
  content?: string;
  tag: Tag;
}

export type Tag = 'Work' | 'Todo' | 'Personal' | 'Meeting' | 'Shopping';

export const TAGS: Tag[] = ['Work', 'Todo', 'Personal', 'Meeting', 'Shopping'];