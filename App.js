import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { HomeScreen } from './HomeScreen';
import { LoginScreen } from './LoginScreen';

const RootStack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: () => ({
        headerTitle: 'Anmeldung',
        headerStyle: {
          backgroundColor: '#1976d2',
        },
        headerTintColor: '#fff',
      })
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        headerTitle: 'Übersicht',
        headerStyle: {
          backgroundColor: '#1976d2',
        },
        headerTintColor: '#fff',
      })
    }
  },
  {
    initialRouteName: 'Home'
  }
);

export default class App extends React.Component {
  render() {  
    return (
      <RootStack />
    );
  }
}