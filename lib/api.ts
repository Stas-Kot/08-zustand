import axios from 'axios';
import type { NewNote, Note, Tag } from '../types/note';

export interface GetNotesRes {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
const PER_PAGE = 12;

const fetchNotes = async (
  search: string = "",
  page: number = 1,
  tag?: Tag
): Promise<GetNotesRes> => {
  const response = await axios.get<GetNotesRes>('/notes', {
    params: {
      page,
      perPage: PER_PAGE,
      ...(search !== '' && { search: search }),
      ...(tag && { tag: tag }),
    },
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
};

const fetchNoteById = async (id: number): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
};

const deleteNote = async (noteId: number): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
};

const createNote = async (data: NewNote): Promise<Note> => {
  const response = await axios.post<Note>('/notes', data, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
};

export { fetchNotes, deleteNote, createNote, fetchNoteById };
