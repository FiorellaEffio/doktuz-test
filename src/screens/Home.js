import React from 'react';
import {StyleSheet, Image, TouchableOpacity, Button, AsyncStorage, Text, View} from 'react-native';
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
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Hola {this.state.firstName} {this.state.lastName}</Text>
                        <TouchableOpacity onPress={this._logout} title="Cerrar Sesión">
                            <Image style={styles.signOutImage} source={require('../../assets/logout.png')} />
                        </TouchableOpacity>
                    </View>
                    <NavigationContainer style={styles.navigationTabs}>
                        <Tab.Navigator>
                            <Tab.Screen initialParams={{
                                    clientId: this.state.clientId
                                }} name="Registrar solicitud" component={MapScreen} />
                            <Tab.Screen initialParams={{
                                    clientId: this.state.clientId,
                                    firstName: this.state.firstName,
                                    lastName: this.state.lastName
                                    }} name="Solicitudes" component={ProfileScreen} />
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
    header: {
        flexDirection: 'row',
        position: 'relative', 
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%', 
        height: 70,
        padding: 15
    },
    headerText: {
        color: "#095a95",
        fontSize: 18
    },
    signOutImage: {
        width: 25,
        height: 25,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
})