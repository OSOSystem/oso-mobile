import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { BASE_URL, KEY } from './Constants';

export class SettingsScreen extends React.Component {
  constructor() {
    super();
    this.state = { id: '' };
  }
  
  async componentDidMount() {
    try {
      const item = await AsyncStorage.getItem(KEY);
      console.log(item);
      if (item !== null) {
        this.setState({ id: item })
      }
    } catch (error) {
      console.log(error);
    }
  }

  async _saveHelpProvider() {
    try {
      console.log(`Saving ${this.state.id} to storage`);
      await AsyncStorage.setItem(KEY, this.state.id);

      fetch(`${BASE_URL}/help-provider`, {
        method: 'POST',
        body: JSON.stringify({id: parseInt(this.state.id, 10)})
      });
      console.log('Saved value');
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <TextInput placeholder="Id" 
                     onChangeText={ text => this.setState({ id: text }) } 
                     value={ this.state.id } 
                     style={{ flex: 1, marginLeft: 10, marginRight: 10 }} />
          <Button title="Save" 
                  onPress={() => this._saveHelpProvider()} 
                  style={{ flex: 1, marginRight: 10 }} />
        </View>
      </View>
    );
  }
}