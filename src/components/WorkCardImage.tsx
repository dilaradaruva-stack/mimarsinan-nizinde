import React, { useState, useEffect } from 'react';
import { Work } from '../types';
import { getWikipediaImage } from '../services/wikipediaService';

interface Props {
  work: Work;
}

export default function WorkCardImage({ work }: Props) {
  const [image, setImage] = useState<string | null>(work.image || null);
  const [loading, setLoading] = useState(!work.image);

  useEffect(() => {
    let isMounted = true;
    if (work.image) {
      setImage(work.image);
      setLoading(false);
    } else {
      setLoading(true);
      getWikipediaImage(work.name).then(url => {
        if (isMounted) {
          setImage(url);
          setLoading(false);
        }
      });
    }
    return () => { isMounted = false; };
  }, [work.name, work.image]);

  if (!image && !loading) {
     return null;
  }

  return (
    <div className="w-full h-48 bg-gray-200 dark:bg-stone-700 overflow-hidden shrink-0 border-b border-[#D1D5DB] dark:border-stone-700 flex items-center justify-center">
      {loading ? (
         <div className="w-6 h-6 border-2 border-[#991B1B] border-t-transparent rounded-full animate-spin"></div>
      ) : image ? (
         <img src={image} referrerPolicy="no-referrer" alt={work.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : null}
    </div>
  );
}
