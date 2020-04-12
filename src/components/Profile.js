import React from 'react';
import {Text, AsyncStorage, Button, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attentionList: [],
            loading: true,
        }
        this._loadAttentionListByClientId();
    }

    createAttentionList = () => {
        let attentions = [];
        for(let i = 0; i < this.state.attentionList.length; i++){
            attentions.push(
                <View key = {i}>
                    <Text>Numero de orden: {this.state.attentionList[i].id}</Text>
                    <Text>Estado de la orden: {this.state.attentionList[i].currentStatus}</Text>
                </View>
            )
        }
        return attentions;
    }

    render() {
        if(this.state.loading) {
            return <Text>Cargando...</Text>
        } else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Hola {this.props.route.params.firstName} {this.props.route.params.lastName}</Text>
                    <Text>Lista de solicitudes...</Text>
                    <View>
                        { this.createAttentionList() }
                    </View>
                </View>
            );
        }
    }

    _loadAttentionListByClientId = async () => {
        let userId = await AsyncStorage.getItem('userId');
        fetch(`http://devapi.doktuz.com:8080/goambu/api/attentions/get-attentions-per-client?client-id=${this.props.route.params.clientId}`)
        .then(response => response.json())
        .then(responseData => {
            this.setState({
                attentionList: responseData,
                loading: false
            });
        })      
        .catch(error => {
            alert(error);
        })
    }
}