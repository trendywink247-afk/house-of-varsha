import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description?: string;
}

export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    const fullTitle = title === 'Home'
      ? 'House of Varsha | Handcrafted Indian Ethnic Wear'
      : `${title} | House of Varsha`;

    document.title = fullTitle;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', description);
      }
    }

    // Cleanup: restore default on unmount
    return () => {
      document.title = 'House of Varsha | Handcrafted Indian Ethnic Wear';
    };
  }, [title, description]);
}
