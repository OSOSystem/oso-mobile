import React from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, Alert, ScrollView, FlatList } from 'react-native';

class Contact extends React.Component {  
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row', margin: 15, borderWidth: 1, borderRadius: 4, borderColor: 'grey'}}>
        <Image source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}} style={{margin: 10, width: 50, height: 50}} />
        <View style={{flex: 1, flexDirection: 'column', marginTop: 5}}>
          <Text>{this.props.name}</Text>
          <Text>{this.props.phoneNumber}</Text>
          <Text>{this.props.lastLocation}</Text>
        </View>
      </View>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {contacts: this.getContacts(), username: '', phoneNumber: ''};
  }
  
  getContacts() {
    // return fetch('http://51.38.113.244/contacts')
    //   .then(response => response.json())
    //   .catch(error => console.log(error))
    return [{name: 'Peter', phoneNumber: 123456, lastLocation: 'Schmiedeweg 1'}, {name: 'Hans', phoneNumber: 789010, lastLocation: 'Ringstraße 5'}]
  }

  componentDidMount() {
    // contacts = this.getContacts();
    // const ws = new WebSocket('wss://51.38.113.244')
    // ws.onopen = () => {
    //   console.log('Connection established');
    // }

    // ws.onmessage = (message) => {
    //   console.log(message);
    // }

    // ws.onerror = (error) => {
    //   console.log(error);
    // }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <FlatList data={this.state.contacts} 
                  renderItem={({item}) => <Contact name={item.name} phoneNumber={item.phoneNumber} lastLocation={item.lastLocation}/>} 
                  keyExtractor={(item, index) => index.toString()}
        />
        <View style={{margin: 10}}>
          <TextInput placeholder="Name" onChangeText={text => this.setState({username: text})} />
          <TextInput placeholder="Phonenumber e.g (0157...)" onChangeText={text => this.setState({phoneNumber: text})} />
          <Button title="+" onPress={() => {
            this.setState({contacts: [...this.state.contacts, {name: this.state.username, phoneNumber: this.state.phoneNumber, lastLocation: 'unknown'}]});
            console.log(this.state.contacts);
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