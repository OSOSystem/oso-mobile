import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, TextInput, Button } from 'react-native';

const KEY = '@storage:email';
const BASE_URL = 'http://51.38.113.244:8080';
// const BASE_URL = 'http://5c5c4a9f.ngrok.io';

export class SettingsScreen extends React.Component {
  constructor() {
    super();
    this.state = { email: '' };
  }
  
  componentDidMount() {
    const fetchItem = async () => {
      try {
        const value = await AsyncStorage.getItem(KEY);
        console.log(value);
        if (value !== null) {
          this.setState({ email: value })
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchItem();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <TextInput placeholder="E-Mail" onChangeText={ text => this.setState({ email: text }) } value={ this.state.email } style={{ flex: 1, marginLeft: 10, marginRight: 10 }} />
          <Button title="Save" onPress={async () => {
            try {
              await AsyncStorage.setItem(KEY, this.state.email);
            
              fetch(`${BASE_URL}/help-provider`, {
                method: 'POST',
                body: JSON.stringify({name: "X", email: this.state.email})
              });
              console.log('Saved value');
            } catch (error) {
              console.log(error);
            } 
          }} style={{ flex: 1, marginRight: 10 }} />
        </View>
      </View>
    );
  }
}