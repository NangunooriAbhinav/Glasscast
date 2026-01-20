import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { AuthStackParamList } from './types';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        presentation: 'modal',
      }}
    >
      <Stack.Screen
        name="Login"
        getComponent={() => require('../screens/Auth/LoginScreen').LoginScreen}
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="Signup"
        getComponent={() => require('../screens/Auth/SignupScreen').SignupScreen}
        options={{
          title: 'Sign Up',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;