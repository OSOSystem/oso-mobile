import React from 'react';
import { AsyncStorage, Button, TextInput, View } from 'react-native';
import { BASE_URL, KEY } from './Constants';
import { registerForPushNotificationsAsync } from './PushNotification';

export class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "", email: "", password: "" }
    }

    async _saveHelpProvider() {
        try {

            const response =
                await fetch(`${BASE_URL}/help-providers`, {
                    method: 'POST',
                    body: JSON.stringify({
                        name: this.state.name,
                        email: this.state.email,
                        expoPushToken: expoPushToken,
                        password: this.state.password
                    })
                });
            const id = response.headers.map.location[0].split('/')[1];
            console.log(id);


            this.props.navigation.navigate('Home', {id : id});
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 25, paddingRight: 25 }}>
                <TextInput placeholder="Name" onChangeText={text => this.setState({ name: text })} />
                <TextInput placeholder="E-Mail" onChangeText={text => this.setState({ email: text })} />
                <TextInput placeholder="Password" onChangeText={text => this.setState({ password: text })} secureTextEntry={true} />
                <Button title="Create" onPress={() => this._saveHelpProvider()} />
            </View>
        );
    }
}