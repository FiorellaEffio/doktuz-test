import React from 'react';
import {Text, AsyncStorage, Button, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Solicitudes...</Text>
                <Text>{this.props.route.params.clientId}</Text>
            </View>
        );
    }
}