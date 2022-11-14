import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {Photo, useAlbum} from '../hooks/useAlbum';
import {consoleCount} from '../utils';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function HomeScreen(): React.ReactElement {
  const {data, onLoadNext} = useAlbum(100);

  const [photoIds, setPhotoIds] = useState<string[]>([]);

  const onPress = (photo: Photo) => {
    setPhotoIds(([...draft]) => {
      const idx = draft.indexOf(photo.id);

      if (idx > -1) {
        draft.splice(idx, 1);
      } else {
        draft.push(photo.id);
      }

      return draft;
    });
  };

  const renderItem = useCallback(
    ({item}) => (
      <PhotoView
        key={item.id}
        selected={photoIds.indexOf(item.id) > -1}
        photo={item}
        onPress={onPress}
      />
    ),
    [photoIds],
  );
  const keyExtractor = useCallback((item: Photo) => item.id, []);

  const getItemLayout = (data: Photo[] | null | undefined, index: number) => ({
    length: windowWidth * 0.33,
    offset: windowWidth * 0.33 * index,
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.sectionContainer}
        numColumns={3}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onLoadNext}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        getItemLayout={getItemLayout}
      />
    </View>
  );
}

type PhotoViewProps = {
  selected: boolean;
  photo: Photo;
  onPress: (photo: Photo) => void;
};

const PhotoView = React.memo(({photo, onPress, selected}: PhotoViewProps) => {
  const [loading, setLoading] = useState(true);

  consoleCount('render PhotoView:' + photo.id);

  useEffect(() => {
    return () => {
      consoleCount('unmount PhotoView:' + photo.id);
    };
  }, []);

  return (
    <Pressable style={styles.image} onPress={() => onPress(photo)}>
      <Image
        onLoadEnd={() => setLoading(false)}
        resizeMode={'cover'}
        source={{uri: photo.url}}
        style={StyleSheet.absoluteFill}
      />
      {!loading && (
        <View
          style={[
            styles.mark,
            {backgroundColor: selected ? '#3175ff' : '#f8f8f8'},
          ]}
        />
      )}
      {loading && (
        <ActivityIndicator style={StyleSheet.absoluteFill} color={'#363638'} />
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
    width: '33%',
    // height: 120,
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
