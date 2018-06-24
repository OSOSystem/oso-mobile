import {Notifications} from 'expo';
import React from 'react';
import { Alert, AsyncStorage, Linking, Platform, ScrollView, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { BASE_URL, KEY } from './Constants';
import { HelpRequester } from './HelpRequester';
import { SettingsScreen } from './SettingsScreen';
import { registerForPushNotificationsAsync } from './PushNotification';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { helpRequesters: [] };
  }

  async componentDidMount() {
    try {
      await registerForPushNotificationsAsync();
      const id = await AsyncStorage.getItem(KEY);
      console.log(`Fetched helpRequesterId from storage: ${id}`);
      this.setState({ helpProviderId: id });

      fetch(`${BASE_URL}/help-providers/${id}/help-requesters`)
        .then(response => response.json())
        .then(json => {
          this.setState({ helpRequesters: json });
        })
        .catch(error => console.log(error));
    } catch (error) {
      console.log(error);
    }

    Notifications.addListener(notification => {
      const data = notification.data;
      Alert.alert(
        'Emergency',
        `${data.emergency.coordinates}`,
        [
          {text: 'Accept', onPress: this.acceptEmergency(emergency)},
          {text: 'Decline', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
        ]
      )      
    });
  }

  acceptEmergency(emergency) {
    fetch(`${BASE_URL}/help-providers/accept-emergency`, {
      method: 'POST',
      body: JSON.stringify(emergency)
    })
  }

  openGoogleMaps(emergency) {
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=:';
    const lat = emergency.latitude;
    const lng = emergency.longitude;
    const latLng = `${lat},${lng}`;
    const url = Platform.OS === 'ios' ? `${scheme}@${latLng}` : `${scheme}${latLng})`;

    Linking.openURL(url);
  }

  deleteHelpRequester(id) {
    const newState = this.helpRequesters.filter(helpRequester => helpRequester.id !== id);
    this.setState({ helpRequesters: newState });
    // fetch(`${BASE_URL}/help-requesters/${this.props.id}`, {
    //   method: 'DELETE'
    // });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {
            this.state.helpRequesters.map(helpRequester => {
              return 
                <HelpRequester 
                  id={helpRequester.id} 
                  name={helpRequester.name} 
                  lastLocation={helpRequester.lastLocation} 
                  key={helpRequester.id} 
                  handler={() => this.deleteHelpRequester(helpRequester.id)} />
            })
          }
        </ScrollView>
      </View>
    );
  }
}

export default createBottomTabNavigator({
  Home: HomeScreen,
  Settings: SettingsScreen
});