import React from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, Alert, ScrollView, FlatList, Platform, Linking, Modal } from 'react-native';

class Contact extends React.Component {  
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row', margin: 15, borderWidth: 1, borderRadius: 4, borderColor: 'grey'}}>
        <Image source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}} style={{margin: 10, width: 50, height: 50}} />
        <View style={{flex: 4, flexDirection: 'column', marginTop: 5}}>
          <Text>{this.props.name}</Text>
          <Text>{this.props.phoneNumber}</Text>
          <Text>{this.props.lastLocation}</Text>
          <Button title="-" onPress={this.props.handler} color="red" />
        </View>
      </View>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {contacts: this.getContacts(), id: 3, username: '', phoneNumber: '', modalVisible: false};
  }
  
  getContacts() {
    // return fetch('http://51.38.113.244:8080/contacts')
    //   .then(response => response.json())
    //   .catch(error => console.log(error))
    return [{id: 1, name: 'Peter', phoneNumber: 123456, lastLocation: 'Schmiedeweg 1'}, {id: 2, name: 'Hans', phoneNumber: 789010, lastLocation: 'Ringstraße 5'}]
  }

  componentDidMount() {
    const ws = new WebSocket('ws://51.38.113.244:8080/notify')
    ws.onopen = () => {
      console.log('Connection established');
      // ws.send(JSON.stringify({
      //   type: 'REGISTER',
      //   payload: {
      //     name:
      //   }
      // }));
    }

    ws.onmessage = (event) => {
      const msg = event.data;
      console.log(msg)
      Alert.alert(`Received an emergency from ${msg}`)
    }

    ws.onerror = (error) => {
      console.log('Error');
    }
  }

  render() {
    return (
      <View style={[{flex: 1}, this.state.modalVisible ? {backgroundColor: 'rgba(0, 0, 0, 0.5)'} : '']}>
        <Modal animationType="slide" transparent={true} visible={this.state.modalVisible} onRequestClose={() => console.log('hi')}>
          <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 100,
          backgroundColor: 'blue',
          height: 300}}>
            <Text>Hi</Text>
          </View>
        </Modal>
        <FlatList data={this.state.contacts} 
                  renderItem={({item}) => <Contact name={item.name} phoneNumber={item.phoneNumber} lastLocation={item.lastLocation} handler={() => this.setState({contacts: [...this.state.contacts.splice(item.id - 1, 1)]})} />}
                  keyExtractor={item => `${item.id}`}
        />
        <View style={{margin: 10}}>
          <TextInput placeholder="Name" onChangeText={text => this.setState({username: text})} />
          <TextInput placeholder="Phonenumber e.g (0157...)" onChangeText={text => this.setState({phoneNumber: text})} />
          <Button title="+" onPress={() => {
            if (this.state.username === '' || this.state.phoneNumber === '') {
              Alert.alert('Empty')
              return;
            }

            this.setState({contacts: [...this.state.contacts, {id: this.state.id, name: this.state.username, phoneNumber: this.state.phoneNumber, lastLocation: 'unknown'}], id: this.state.id + 1, modalVisible: true});
            console.log(this.state.contacts);
            // const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=:';
            // const lat = -34.397;
            // const lng = 150.644
            // const latLng = `${lat},${lng}`;
            // const label = 'Custom Label';
            // const url = Platform.OS === 'ios' ? `${scheme}@${latLng}` : `${scheme}${latLng})`;

            // Linking.openURL('google.navigation:q=bahnstraße+13+wipperfürth'); 
          }} />
        </View>
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

export default App;