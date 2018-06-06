import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';

export class HelpRequester extends React.Component {
    constructor() {
      super();
    }
  
    delete() {
      fetch(`${BASE_URL}/help-requesters/${this.props.id}`, {
        method: 'DELETE'
      });
    }
  
    render() {
      return (
        <View style={{ flex: 1, flexDirection: 'row', margin: 20, borderWidth: 1, borderRadius: 4, borderColor: 'grey', alignItems: 'center', padding: 20 }}>
          <Image source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }} style={{ flex: 1, width: 50, height: 50, marginRight: 10 }} />
          <View style={{ flex: 4, flexDirection: 'column' }}>
            <Text>{this.props.id}</Text>
            <Text>{this.props.name}</Text>
            <Text>{this.props.lastLocation}</Text>
          </View>
          <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'center' }}>
            <Button title="-" onPress={this.props.handler} color="red" />
          </View>
        </View>
      );
    }
  }