import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {type Photo, useAlbum} from '../hooks/useAlbum';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {consoleCount} from '../utils';
import FastImage from 'react-native-fast-image';

export default function HomeScreen(): React.ReactElement {
  const {data, onLoadNext} = useAlbum(100);

  const [photoIds, setPhotoIds] = useState<string[]>([]);

  const onPressPhoto = useCallback((photo: Photo) => {
    setPhotoIds(([...draft]) => {
      const idx = draft.indexOf(photo.id);

      if (idx > -1) {
        draft.splice(idx, 1);
      } else {
        draft.push(photo.id);
      }

      return draft;
    });
  }, []);

  const renderItem: ListRenderItem<Photo> = ({item}) => (
    <PhotoView
      key={item.id}
      selected={photoIds.indexOf(item.id) > -1}
      photo={item}
      onPress={onPressPhoto}
    />
  );

  const keyExtractor = (item: Photo) => item.id;

  const getItemLayout = (items: Photo[] | undefined | null, index: number) => ({
    length: 120,
    offset: 120 * index,
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        removeClippedSubviews
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.sectionContainer}
        getItemLayout={getItemLayout}
        numColumns={3}
        data={data}
        renderItem={renderItem}
        onEndReached={onLoadNext}
      />
    </View>
  );
}

type PhotoViewProps = {
  selected: boolean;
  photo: Photo;
  onPress: (photo: Photo) => void;
};

const PhotoView = memo(({photo, onPress, selected}: PhotoViewProps) => {
  const [loading, setLoading] = useState(true);

  const onPressPhotoView = useCallback(() => onPress(photo), [photo, onPress]);
  const onLoadEndImage = useCallback(() => setLoading(false), []);

  consoleCount('render PhotoView:' + photo.id);

  useEffect(() => {
    return () => {
      consoleCount('unmount PhotoView:' + photo.id);
    };
  }, [photo.id]);

  return (
    <Pressable style={styles.image} onPress={onPressPhotoView}>
      <FastImage
        onLoadEnd={onLoadEndImage}
        resizeMode={'cover'}
        source={{uri: photo.url}}
        style={StyleSheet.absoluteFill}
      />
      {loading && (
        <ActivityIndicator style={StyleSheet.absoluteFill} color={'#363638'} />
      )}
      {!loading && (
        <View
          style={[
            styles.mark,
            {backgroundColor: selected ? '#3175ff' : '#f8f8f8'},
          ]}
        />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  sectionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  image: {
    borderColor: 'white',
    borderWidth: 1,
    width: '33.3%',
    height: 120,
    aspectRatio: 1,
  },
  mark: {
    borderWidth: 1,
    borderColor: 'gray',
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    right: 5,
    top: 5,
  },
});
