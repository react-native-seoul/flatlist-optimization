import 'dayjs/locale/ko';

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Post, useFeed} from '../hooks/useFeed';
import React, {memo, useCallback, useEffect, useState} from 'react';

import FastImage from 'react-native-fast-image';
import {ListRenderItem} from 'react-native';
import {consoleCount} from '../utils';
import dayjs from 'dayjs';
import lf from 'dayjs/plugin/localizedFormat';

dayjs.locale('ko');
dayjs.extend(lf);

export default function FeedScreen(): React.ReactElement {
  const {data, onLoadNext} = useFeed(30);

  const renderItem: ListRenderItem<Post> = useCallback(
    ({item}) => <PostCard key={item.id} post={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const itemSeparatorComponent = useCallback(
    () => <View style={{height: 24}} />,
    [],
  );

  return (
    <FlatList
      removeClippedSubviews
      style={styles.container}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={itemSeparatorComponent}
      onEndReached={onLoadNext}
    />
  );
}

type PostCardProps = {
  post: Post;
};

const PostCard = memo(({post}: PostCardProps) => {
  const [loading, setLoading] = useState(true);

  consoleCount('render PostCard:' + post.id);

  useEffect(() => {
    return () => {
      consoleCount('unmount PostCard:' + post.id);
    };
  }, [post.id]);

  return (
    <View>
      <View style={styles.top}>
        <FastImage
          resizeMode={'cover'}
          source={{uri: post.profile}}
          style={styles.profile}
        />
        <Text style={styles.author}>{post.author}</Text>
      </View>

      <View style={styles.image}>
        <FastImage
          onLoadEnd={() => setLoading(false)}
          resizeMode={'cover'}
          source={{uri: post.photo}}
          style={StyleSheet.absoluteFill}
        />
        {loading && (
          <ActivityIndicator
            style={StyleSheet.absoluteFill}
            color={'#363638'}
          />
        )}
      </View>

      <View style={styles.bottom}>
        <View style={styles.icons}>
          <View style={styles.iconsLeft}>
            <Image
              source={require('../../assets/Like.png')}
              style={styles.icon}
              resizeMode={'contain'}
            />
            <Image
              source={require('../../assets/Comment.png')}
              style={styles.icon}
              resizeMode={'contain'}
            />
            <Image
              source={require('../../assets/Share.png')}
              style={styles.icon}
              resizeMode={'contain'}
            />
          </View>
          <View>
            <Image
              source={require('../../assets/Bookmark.png')}
              style={[styles.icon, {marginRight: 0}]}
            />
          </View>
        </View>
        <View>
          <Text style={styles.likes}>{`${post.likes}명이 좋아합니다.`}</Text>
          <Text style={styles.content}>{post.content}</Text>
          <Text style={styles.createdAt}>
            {dayjs(post.createdAt).format('LL')}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  image: {
    aspectRatio: 1,
    backgroundColor: '#f8f8f8',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  profile: {
    backgroundColor: '#ccc',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottom: {
    paddingHorizontal: 16,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  iconsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 16,
  },
  likes: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    marginBottom: 8,
  },
  createdAt: {
    fontSize: 12,
    color: '#757575',
  },
});
