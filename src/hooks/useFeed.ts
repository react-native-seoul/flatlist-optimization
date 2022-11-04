import {UseDataList} from '../types';
import {faker} from '@faker-js/faker/locale/ko';
import {useCallback, useRef, useState} from 'react';

export interface Post {
  id: string;

  content: string;
  photo: string;

  likes: number;
  author: string;
  profile: string;
  createdAt: Date;
}

function createPost(): Post {
  return {
    id: faker.datatype.uuid(),
    content: faker.lorem.text(),
    photo: faker.image.abstract(600, 600, true),
    likes: faker.datatype.number({min: 0, max: 800}),
    author: faker.name.fullName(),
    profile: faker.image.people(300, 300, true),
    createdAt: faker.date.past(),
  };
}

function createFeed(length = 20) {
  return Array.from({length})
    .map(createPost)
    .sort((a, b) => b.createdAt.getDate() - a.createdAt.getDate());
}

const feed = createFeed(500);

export const useFeed: UseDataList<Post> = (limit = 20) => {
  const cursor = useRef(limit);
  const [data, setData] = useState(() => feed.slice(0, limit));

  return {
    data,
    onLoadNext: useCallback(() => {
      const next = feed.slice(cursor.current, cursor.current + limit);
      cursor.current = cursor.current + limit;
      setData(prev => prev.concat(next));
    }, []),
  };
};
