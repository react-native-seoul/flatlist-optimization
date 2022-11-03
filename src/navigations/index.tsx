import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/Home';
import {Image, StatusBar, View} from 'react-native';

const RootTab = createBottomTabNavigator();

export default function Navigator() {
  return (
    <NavigationContainer
      onReady={() => {
        console.log('ready!');
      }}>
      <StatusBar animated={true} />
      <RootTab.Navigator initialRouteName="Home">
        <RootTab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '앨범',
            tabBarIcon: () => (
              <View>
                <Image
                  source={require('../../assets/gallery.png')}
                  style={{width: 30, height: 30}}
                />
              </View>
            ),
          }}
        />
      </RootTab.Navigator>
    </NavigationContainer>
  );
}
