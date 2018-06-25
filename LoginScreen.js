import { Notifications } from 'expo';
import React from 'react';
import { Alert, AsyncStorage, FlatList, Linking, Platform, View, TextInput, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { BASE_URL, KEY } from './Constants';
import { HelpRequester } from './HelpRequester';
import { registerForPushNotificationsAsync } from './PushNotification';
import { SettingsScreen } from './SettingsScreen';

export class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "", email: "", password: "" }
    }

    async componentDidMount() {
        try {
            const created = await AsyncStorage.getItem(KEY)
            this.props.navigation.navigate('Home');
        } catch (error) {
            console.log(error);
        }
    }

    async _saveHelpProvider() {
        try {
            const expoPushToken = await registerForPushNotificationsAsync();
            const response =
                await fetch(`${BASE_URL}/help-provider`, {
                    method: 'POST',
                    body: JSON.stringify({
                        name: this.state.name,
                        email: this.state.email,
                        expoPushToken: expoPushToken,
                        password: this.state.password
                    })
                });

            await AsyncStorage.setItem(KEY, true);
            this.props.navigation.navigate('Home');
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
                <Button title="Anemdeln & Login" onPress={() => this._saveHelpProvider} />
            </View>
        );
    }
}