/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback} from 'react';
import Navigation from './src/navigations/index';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {LogBox} from 'react-native';
import {
  PerformanceProfiler,
  RenderPassReport,
} from '@shopify/react-native-performance';

const App = () => {
  const onReportPrepared = useCallback((report: RenderPassReport) => {
    console.log(report);
  }, []);

  return (
    <>
      <SafeAreaProvider>
        <PerformanceProfiler onReportPrepared={onReportPrepared}>
          <Navigation />
        </PerformanceProfiler>
      </SafeAreaProvider>
    </>
  );
};

LogBox.ignoreLogs(['Task orphaned for request']);

export default App;
