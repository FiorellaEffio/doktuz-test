import React from 'react';
import {StyleSheet, Button, AsyncStorage, Text, View} from 'react-native';

export default class HomeScreen extends React.Component {
    render() {
        return(
        <View style={styles.container}>
            <Text style={styles.welcome}>
            welcome Logged Page
            </Text>
            <Button onPress={this._logout} title="Logout"/>
        </View>
        );
    }

    _logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
})