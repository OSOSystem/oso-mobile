import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button, Image, TextInput, Alert, ScrollView, FlatList, Linking, Modal, Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { SettingsScreen } from './SettingsScreen';
import { mo } from 'react-native-modal';

const KEY = '@storage:email';
const BASE_URL = 'http://51.38.113.244:8080';
// const BASE_URL = 'http://5c5c4a9f.ngrok.io';

class HelpRequester extends React.Component {
  constructor() {
    super();
  }

  delete() {
    this.props.handler();
    fetch(`${BASE_URL}/help-requesters/${this.props.id}`, {
      method: 'DELETE'
    });
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row', margin: 20, borderWidth: 1, borderRadius: 4, borderColor: 'grey', alignItems: 'center', padding: 20 }}>
        <Image source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }} style={{ flex: 1, width: 50, height: 50 }} />
        <View style={{ flex: 4, flexDirection: 'column' }}>
          <Text>{this.props.id}</Text>
          <Text>{this.props.name}</Text>
          <Text>{this.props.lastLocation}</Text>
        </View>
        <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'center' }}>
          <Button title="-" onPress={this.delete} color="red" />
        </View>
      </View>
    );
  }
}

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { contacts: [], id: '', name: '', email: ''};
  }

  async componentDidMount() {
    try {
      const email = await AsyncStorage.getItem(KEY);
      console.log(`Got email: ${email}`);
      this.setState({ email: email });
      fetch(`${BASE_URL}/help-providers/${email}/help-requesters`)
        .then(response => response.json())
        .then(json => {
          this.setState({ contacts: json });
          console.log(this.state.contacts);
        })
        .catch(error => console.log(error));
    } catch (error) {
      console.log(error);
    }

    const ws = new WebSocket('ws://51.38.113.244:8080/notify');
    ws.onopen = () => {
      console.log('Connection established');
    }

    ws.onmessage = (event) => {
      const msg = event.data;
      console.log(msg.longitude);
      console.log(msg.latitude);
      Alert.alert('Emergency', 'Received an emergency', [{text: 'Decline', onPress: () => console.log('hi')}, {text: 'Accept', onPress: () => this.openGoogleMaps(msg)}]);
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
    const label = 'Custom Label'; 
    const url = Platform.OS === 'ios' ? `${scheme}@${latLng}` : `${scheme}${latLng})`;

    Linking.openURL(url); 
  }

  // handler={() => this.setState({ contacts: this.state.contacts.filter(contact => contact.id !== item.id)}) }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {
            this.state.contacts.map(item => {
              return <HelpRequester id={item.id} name={item.name} lastLocation={item.lastLocation} key={item.id}/>
            })
          }
        </ScrollView>
        <View style={{ margin: 10 }}>
          <TextInput placeholder="Id" onChangeText={text => this.setState({ id: text })} />
          <TextInput placeholder="Name" onChangeText={text => this.setState({ name: text })} />
          <Button title="+" color="green" onPress={() => {
            if (this.state.id === '') {
              Alert.alert('Id cannot be empty!')
              return;
            }

            if (this.state.name === '') {
              Alert.alert('Name cannot be empty!')
              return;
            }
            
            const helpRequester = { id: this.state.id, name: this.state.name, lastLocation: 'unknown' };
            this.setState({ contacts: [...this.state.contacts, helpRequester]});
            
            fetch(`${BASE_URL}/help-requester`, {
              method: 'POST',
              body: JSON.stringify(helpRequester)
            });

            fetch(`${BASE_URL}/contact`, {
              method: 'POST',
              body: JSON.stringify({helpRequesterId: helpRequester.id, helpProviderId: this.state.email})
            });

            console.log(this.state.contacts);
          }} />
        </View>
      </View>
    );
  }
}

export default createBottomTabNavigator({
  Home: HomeScreen,
  Settings: SettingsScreen
});