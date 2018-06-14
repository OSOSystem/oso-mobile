import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button, Image, TextInput, Alert, ScrollView, FlatList, Linking, Modal, Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { SettingsScreen } from './SettingsScreen';
import { HelpRequester } from './HelpRequester';
import { BASE_URL, KEY } from './Constants';
import { registerForPushNotificationsAsync } from './Test'
import Expo from 'expo';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { contacts: [], id: '', name: '', email: ''};
  }

  async componentDidMount() {
    try {
      console.log('mounting component');
      await registerForPushNotificationsAsync();
      console.log('blocking');
      const email = await AsyncStorage.getItem(KEY);
      console.log(`Got email: ${email}`);
      this.setState({ email: email });
      fetch(`${BASE_URL}/help-providers/${email}/help-requesters`)
        .then(response => response.json())
        .then(json => {
          this.setState({ contacts: json });
        })
        .catch(error => console.log(error));
    } catch (error) {
      console.log(error);
    }

    const ws = new WebSocket('ws://51.38.113.244:8080/notify');
    ws.onopen = () => {
      console.log('Connection established');
      Expo.Notifications.presentLocalNotificationAsync({title: 'Title', body: 'Body'});
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      Alert.alert('Emergency', `Received an emergency from location: ${msg.formattedAddress}`, [{text: 'Decline', onPress: () => console.log('hi')}, {text: 'Accept', onPress: () => this.openGoogleMaps(msg)}]);
    }

    ws.onerror = (error) => {
      console.log('Error');
    }
  }

  openGoogleMaps(msg) {
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=:';
    const lat = msg.latitude;
    const lng = msg.longitude;
    const latLng = `${lat},${lng}`;
    const url = Platform.OS === 'ios' ? `${scheme}@${latLng}` : `${scheme}${latLng})`;

    Linking.openURL(url); 
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {
            this.state.contacts.map(item => {
              return <HelpRequester id={item.id} name={item.name} lastLocation={item.lastLocation} key={item.id} handler={() => console.log('hi')}/>
            })
          }
        </ScrollView>
        <View style={{ margin: 10 }}>    
            {/* fetch(`${BASE_URL}/help-requester`, {
              method: 'POST',
              body: JSON.stringify(helpRequester)
            });

            fetch(`${BASE_URL}/contact`, {
              method: 'POST',
              body: JSON.stringify({helpRequesterId: helpRequester.id, helpProviderId: this.state.email})
            }); */}
          {/* }} /> */}
        </View>
      </View>
    );
  }
}

export default createBottomTabNavigator({
  Home: HomeScreen,
  Settings: SettingsScreen
});