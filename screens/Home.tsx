import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const URL = 'https://source.unsplash.com/random';
const Images: string[] = Array(13).fill(URL);

export default function HomeScreen(): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        {Images.map((data, index) => (
          <Image key={data + index} source={{uri: data}} style={styles.image} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  sectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -1,
  },
  image: {
    borderColor: 'white',
    borderWidth: 1,
    width: '33.3%',
    height: 120,
    aspectRatio: 1 / 1,
  },
});
