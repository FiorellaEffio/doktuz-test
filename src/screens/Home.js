import React from 'react';
import {StyleSheet, Button, AsyncStorage, Text, View} from 'react-native';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: ''
        }
        this._loadId();
    }

    render() {
        return(
        <View style={styles.container}>
            <Text style={styles.welcome}>
            welcome Logged Page {this.state.userId}
            </Text>
            <Button onPress={this._logout} title="Logout"/>
        </View>
        );
    }

    _loadId = async () => {
        const userId = await AsyncStorage.getItem('userId');
        console.log(userId);
        this.setState({
            userId
        })
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