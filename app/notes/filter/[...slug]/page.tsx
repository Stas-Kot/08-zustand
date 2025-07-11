import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import css from './NotesPage.module.css';
import NotesClient from './Notes.client';
import { fetchNotes, GetNotesRes } from '@/lib/api';
import { Tag, TAGS} from '@/types/note';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props):Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Notes: ${slug}`,
    description: `Notes filtred by tag: ${slug}`,
    openGraph: {
      title: `Notes: ${slug}`,
      description: `Notes filtred by tag: ${slug}`,
      url: 'https://08-zustand-vert.vercel.app',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub logo',
        },
      ],
    },
  };
}

async function Notes({ params }: Props) {
  const queryClient = new QueryClient();

  const { slug } = await params;
  let currentTag: Tag | undefined = undefined;

  if (Array.isArray(slug) && slug.length > 0) {
    const stringTag = slug[0];
    if (stringTag === 'All') {
      currentTag = undefined; // означает: показываем все заметки
    } else if (TAGS.includes(stringTag as Tag)) {
      currentTag = stringTag as Tag;
    } else {
      console.warn(`Invalid tag provided in slug: ${stringTag}`);
    }
  } else {
    console.info('No slug provided; showing notes without tag filter.');
  }
  

  const initialTag = currentTag;
  const initialSearch = '';
  const initialPage = 1;
  const queryKey = ['notes', initialSearch, initialPage, initialTag];

  await queryClient.prefetchQuery<GetNotesRes>({
    queryKey,
    queryFn: () => fetchNotes(initialSearch, initialPage, initialTag),
  });

  const initialData = queryClient.getQueryData<GetNotesRes>(queryKey);

  if (!initialData) {
    const contextInfo = JSON.stringify(
      {
        queryKey,
        initialSearch,
        initialPage,
        initialTag,
      },
      null,
      2
    );

    throw new Error(
      `Initial data for notes not found in cache after prefetch.\nContext:\n${contextInfo}`
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Toaster />
      <div className={css.app}>
        <NotesClient
          initialTag={initialTag}
          initialData={initialData}
          initialSearch={initialSearch}
          initialPage={initialPage}
        />
      </div>
    </HydrationBoundary>
  );
}

export default Notes;
