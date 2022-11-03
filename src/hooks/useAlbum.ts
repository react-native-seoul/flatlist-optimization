import {UseDataList} from '../types';
import {faker} from '@faker-js/faker';
import {useCallback, useRef, useState} from 'react';

export interface Photo {
  id: string;
  url: string;
}

function createPhoto(): Photo {
  return {id: faker.datatype.uuid(), url: faker.image.image(640, 640, true)};
}

function createAlbum(length = 20) {
  return Array.from({length}).map(createPhoto);
}

const album = createAlbum(500);

export const useAlbum: UseDataList<Photo> = (limit = 20) => {
  const cursor = useRef(limit);
  const [data, setData] = useState(() => album.slice(0, limit));

  return {
    data,
    onLoadNext: useCallback(() => {
      const next = album.slice(cursor.current, cursor.current + limit);
      cursor.current = cursor.current + limit;
      setData(prev => prev.concat(next));
    }, []),
  };
};
