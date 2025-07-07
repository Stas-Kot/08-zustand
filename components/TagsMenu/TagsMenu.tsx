'use client';
import { useState } from 'react';
import Link from 'next/link';
import css from './TagsMenu.module.css';
import { TAGS } from '@/types/note';

// enum Tag {
//   Work,
//   Todo,
//   Personal,
//   Meeting,
//   Shopping
// }

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggle}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          <li className={css.menuItem} onClick={toggle}>
            <Link href={`/notes/filter/All`} className={css.menuLink}>
              All notes
            </Link>
          </li>
          {TAGS.map(tag => (
            <li key={tag} className={css.menuItem} onClick={toggle}>
              <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
