import React from 'react';
import {Text, TouchableOpacity, ActivityIndicator, StyleSheet, AsyncStorage, Button, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attentionList: [],
            loading: true,
        }
    }
    componentDidMount() {
        this._reloadAttentionList = this.props.navigation.addListener('focus', () => {
            this._loadAttentionListByClientId();
        });
    }
    componentWillUnmount() {
        this._reloadAttentionList();
    }
    createAttentionList = () => {
        let attentions = [];
        console.log(this.state.attentionList.length);
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
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#095a95" />
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Lista de solicitudes...</Text>
                    <View style={{marginVertical: 50, height: 250}}>
                        <ScrollView>
                            { this.createAttentionList() }
                        </ScrollView>
                    </View>
                    <TouchableOpacity onPress={this._loadAttentionListByClientId}>
                        <Text>Click para actualizar</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    _loadAttentionListByClientId = async () => {
        let userId = await AsyncStorage.getItem('userId');
        fetch(`http://devapi.doktuz.com:8080/goambu/api/clients/${this.props.route.params.clientId}/attentions?client_id=${this.props.route.params.clientId}&organization_id=1`)
        .then(response => response.json())
        .then(responseData => {
            console.log("numero de entradas");
            console.log(responseData.length);
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