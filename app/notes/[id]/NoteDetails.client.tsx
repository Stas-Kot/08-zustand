'use client';
import { useQuery } from '@tanstack/react-query';
import css from './NoteDetails.module.css';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';

const NoteDetailsClient = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id)

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const formattedDate = note?.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note?.createdAt}`;

  return (
    <>
      {isLoading && <p className={`${css.text} ${css.loader}`}>Loading, please wait...</p>}
      {error && <p className={`${css.text} ${css.error}`}>Something went wrong.</p>}
      {note && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              <button className={css.editBtn} disabled>
                Edit note
              </button>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{formattedDate}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteDetailsClient;
