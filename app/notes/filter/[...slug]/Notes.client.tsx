'use client';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './NotesPage.module.css';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes, GetNotesRes } from '@/lib/api';
import { Tag } from '@/types/note';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

interface NotesClientProps {
  initialData: GetNotesRes;
  initialSearch: string;
  initialPage: number;
  initialTag?: Tag;
}

const NotesClient = ({ initialData, initialSearch, initialPage, initialTag: tag }: NotesClientProps) => {
  // const [tag] = useState(initialTag);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isSuccess } = useQuery({
    queryKey: ['notes', debouncedSearch, page, tag],
    queryFn: () => fetchNotes(debouncedSearch, page, tag),
    initialData,
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const totalPages = data?.totalPages || 0;
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handlePageChange = (value: number) => {
    setPage(value);
  };

  return (
    <>
      <header className={css.toolbar}>
        <SearchBox value={search} onSearch={handleSearch} />
        {isSuccess && data?.totalPages > 1 && (
          <Pagination totalPages={totalPages} onPageChange={handlePageChange} page={page} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </>
  );
};

export default NotesClient;
