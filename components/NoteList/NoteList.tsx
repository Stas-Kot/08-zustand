'use client'

import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api";
import toast from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [loadingNoteId, setLoadingNoteId] = useState<number | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onMutate: (id: number) => {
      setLoadingNoteId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setLoadingNoteId(null);
    },
    onError: () => {
      setLoadingNoteId(null);
      toast.error('Something went wrong...Try again, please');
    },
  });

  return (
    <motion.ul className={css.list}>
      {notes.length === 0 && (
        <p className={css.text}>There are no notes yet, so let&apos;s start notating.</p>
      )}
      <AnimatePresence mode="popLayout">
        {notes.map(note => (
          <motion.li
            key={note.id}
            className={css.listItem}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <Link href={`/notes/${note.id}`} className={css.link} scroll={false}>
                View details
              </Link>
              <button
                className={css.button}
                onClick={() => mutate(note.id)}
                disabled={isPending && loadingNoteId === note.id}
              >
                {isPending && loadingNoteId === note.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
