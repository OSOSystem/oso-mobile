import React from 'react';
import { Button, Image, Text, View } from 'react-native';

export class HelpRequester extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row', margin: 20, borderWidth: 1, borderRadius: 4, borderColor: 'grey', alignItems: 'center', padding: 20 }}>
        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFavmj2jfnr_YSBMUsrlbjh4ipSNEgbhGbnffP3VC1Y5j67oYN' }} style={{ flex: 1, width: 50, height: 50, marginRight: 10 }} />
        <View style={{ flex: 4, flexDirection: 'column' }}>
          <Text>{this.props.name}</Text>
        </View>
        <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'center' }}>
          <Button title="-" onPress={this.props.handler} color="red" />
        </View>
      </View>
    );
  }
}