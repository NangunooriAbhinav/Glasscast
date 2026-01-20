import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GlassTabBar } from './GlassTabBar';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        getComponent={() => require('../screens/HomeScreen').HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Search"
        getComponent={() => require('../screens/SearchScreen').SearchScreen}
        options={{
          title: 'Search',
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen
        name="Settings"
        getComponent={() => require('../screens/SettingsScreen').SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;