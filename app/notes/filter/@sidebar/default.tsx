import React from 'react'
import css from './SidebarNotes.module.css'
import Link from 'next/link';
import { TAGS } from '@/types/note';

const SidebarNotes = () => {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href={`/notes/filter/All`} className={css.menuLink}>
          All notes
        </Link>
      </li>
      {TAGS.map((tag, index) => (
        <li key={index} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default SidebarNotes