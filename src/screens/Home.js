import React from 'react';
import {StyleSheet, Button, AsyncStorage, Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../components/Profile';
import MapScreen from '../components/Map';

const Tab = createBottomTabNavigator();

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: '',
            firstName: '',
            lastName: '',
            loading: true
        }
    }
    componentDidMount() {
        this._loadClientId();
    }
    static navigationOptions = {
        headerShown: false
    };

    render() {
        if(this.state.loading) {
            return <Text>Cargando...</Text>
        } else {
            return(
                <View style={styles.container}>
                    <Button onPress={this._logout} title="Logout"/>
                    <NavigationContainer style={styles.navigationTabs}>
                        <Tab.Navigator>
                            <Tab.Screen name="Map" component={MapScreen} />
                            <Tab.Screen initialParams={{
                                    clientId: this.state.clientId,
                                    firstName: this.state.firstName,
                                    lastName: this.state.lastName
                                }} name="Profile" component={ProfileScreen} />
                        </Tab.Navigator>
                    </NavigationContainer>
                </View>
            );
        }
    }

    _loadClientId = async () => {
        let userId = await AsyncStorage.getItem('userId');
        fetch(`http://devapi.doktuz.com:8080/goambu/api/clients?user_id=${userId}`)
        .then(response => response.json())
        .then(responseData => {
            this.setState({
                clientId: responseData.id,
                firstName: responseData.firstName,
                lastName: responseData.lastName,
                loading: false
            })
        })      
        .catch(error => {
            alert(error);
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
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
})