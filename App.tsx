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
import Navigation from './navigations/index';

import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </>
  );
};

export default App;
