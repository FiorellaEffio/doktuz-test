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
        for(let i = 0; i < this.state.attentionList.length; i++){
            attentions.push(
                <View key = {i} style={styles.requestContainer}>
                    <Text style={styles.requestInfo}>N° solicitud: {this.state.attentionList[i].id}</Text>
                    <Text style={styles.requestInfo}>Referencia: {this.state.attentionList[i].reference}</Text>
                    <Text style={styles.requestInfo}>Estado: {this.state.attentionList[i].currentStatus}</Text>
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
                    <Text style={styles.textRequest}>Lista de solicitudes...</Text>
                    <View style={{marginVertical: 20, height: 350,marginHorizontal: 'auto'}}>
                        <ScrollView style={{marginHorizontal: 'auto'}}>
                            { this.createAttentionList() }
                        </ScrollView>
                    </View>
                    <Text style={{marginBottom:5}}>Si no puedes visualizar tu ultima solicitud</Text>
                    <TouchableOpacity style={{
                            backgroundColor: "#095a95", 
                            borderRadius: 20, 
                            height: 40, 
                            width: "80%",
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} onPress={this._loadAttentionListByClientId}>
                        <Text style={{color: "#fff"}}>Click para actualizar</Text>
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
const styles = StyleSheet.create({
    textRequest: {
        color: "#095a95",
        fontSize: 18,
        fontWeight: "700",
    },
    requestContainer:{
        borderColor: "#095a95",
        borderWidth: 2,
        borderRadius: 20,
        marginVertical: 10,
        padding: 10,
        marginHorizontal: 10
    },
    requestInfo: {
        color: "#333",
    }
})