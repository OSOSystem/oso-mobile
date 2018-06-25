import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { HomeScreen } from './HomeScreen';
import { LoginScreen } from './LoginScreen';

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    Home: HomeScreen
  },
  {
    initialRouteName: 'Login'
  }
);

export default class App extends React.Component {
  render() {  
    return (
      <RootStack />
    );
  }
}