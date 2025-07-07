'use client';
import React from 'react';
import css from './NotePreview.module.css';
import { useParams, useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const NotePreviewClient = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const handleClose = () => router.back();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <>
      <Modal onClose={handleClose}>
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{isLoading ? 'Loading...' : isError ? 'Error' : note?.title}</h2>
              <button onClick={handleClose} className={css.backBtn}>
                Close
              </button>
            </div>
            {isError ? (
              <p className={css.content}>Failed to load note.</p>
            ) : isLoading ? (
              <p className={css.content}>Loading content...</p>
            ) : (
              <>
                <p className={css.content}>{note?.content}</p>
                <p className={css.tag}>{note?.tag}</p>
                <p className={css.date}>{note?.createdAt}</p>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NotePreviewClient;
