'use client';
import { useId } from 'react';
import css from './NoteForm.module.css';
import { createNote } from '../../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NewNote, Tag } from '../../types/note';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore';

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleCancel = () => router.back();
  const fieldId = useId();

  
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };
  
  const queryClient = useQueryClient();
  
  const { mutate: addNote, isPending } = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      handleCancel();
    },
    onError: () => {
      toast.error('Something went wrong...Try again, please');
    },
  });
  
  const handleSubmit = (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const values: NewNote = {
      title: String(data.title),
      content: String(data.content || ''),
      tag: data.tag as Tag,
    };
    addNote(values);
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          defaultValue={draft?.title}
          onChange={handleChange}
          className={css.input}
          required
          minLength={3}
          maxLength={50}
          autoFocus
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          defaultValue={draft?.content}
          onChange={handleChange}
          rows={8}
          className={css.textarea}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          defaultValue={draft?.tag}
          onChange={handleChange}
          className={css.select}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" onClick={handleCancel} className={css.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? (
            <>
              <span className={css.spinner} /> Creating...
            </>
          ) : (
            'Create note'
          )}
        </button>
      </div>
    </form>
  );
}
