import React from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';

const URL = 'https://source.unsplash.com/random';
const IMAGES: string[] = Array(150).fill(URL);

export default function HomeScreen(): React.ReactElement {
  const onEndReach = () => {
    const extraImages: string[] = Array(30).fill(URL);
    IMAGES.push(...extraImages);

    console.log(IMAGES.length);
  };
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.sectionContainer}
        numColumns={3}
        data={IMAGES}
        renderItem={({item, index}) => (
          <Image key={item + index} source={{uri: item}} style={styles.image} />
        )}
        onEndReached={onEndReach}
      />
    </View>
  );
}

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
    aspectRatio: 1 / 1,
  },
});
