import { Notifications } from 'expo';
import React from 'react';
import { Alert, FlatList, Linking, Platform, View } from 'react-native';
import { BASE_URL } from './Constants';
import { HelpRequester } from './HelpRequester';

export class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = { helpProviderId: 1, helpRequesters: [] };
    }
  
    async componentDidMount() {
      try {  
        const response = await fetch(`${BASE_URL}/help-providers/${this.state.helpProviderId}/help-requesters`);
        const data = await response.json();
        this.setState({ helpRequesters: data });
      } catch (error) {
        console.log(error);
      }
  
      Notifications.addListener(notification => {
        console.log(notification);
        const data = notification.data;
        const helpRequester = this.state.helpRequesters.filter(helpRequester => helpRequester.id === data.id)
        Alert.alert(
          "Emergency",
          `Received emergency from: ${helpRequester.name}, ${data.formattedAddress}`,
          [
            { text: 'Accept', onPress: () => { this._acceptEmergency(data); this._openGoogleMaps(data) } },
            { text: 'Decline', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
          ]
        )
      });
    }
  
    _acceptEmergency(emergency) {
      console.log(emergency);
      fetch(`${BASE_URL}/help-providers/accept-emergency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emergencyId: emergency.id, helpRequesterId: emergency.helpRequesterId, helpProviderId: this.state.helpProviderId })
      })
    }
  
    _openGoogleMaps(emergency) {
      const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'google.navigation:q=';
      const lat = emergency.coordinates.latitude;
      const lng = emergency.coordinates.longitude;
      const latLng = `${lat}+${lng}`;
      const url = Platform.OS === 'ios' ? `${scheme}@${latLng}` : `${scheme}${latLng}`;
  
      Linking.openURL(url);
    }
  
    _deleteHelpRequester(id) {
      const newState = this.state.helpRequesters.filter(helpRequester => helpRequester.id !== id);
      this.setState({ helpRequesters: newState });
    }
  
    render() {
      return (
        <View style={{ flex: 1 }}>
          <FlatList data={this.state.helpRequesters} keyExtractor={item => `${item.id}`} renderItem={({ item }) => {
            return <HelpRequester name={item.name} lastLocation={item.lastLocation} handler={() => this._deleteHelpRequester(item.id)} />
          }} />
        </View>
      );
    }
  }