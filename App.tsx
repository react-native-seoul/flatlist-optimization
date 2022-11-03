/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import Navigation from './src/navigations/index';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {LogBox} from 'react-native';

const App = () => {
  return (
    <>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </>
  );
};

LogBox.ignoreLogs(['Task orphaned for request']);

export default App;
