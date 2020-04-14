import React from 'react';
import {Platform, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Dimensions, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markerData: {
                latitude: -12.074179,
                longitude: -77.100244,
            },
            mapData: {
                latitude: -12.074179,
                longitude: -77.100244,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            location:null,
            geocodeText: "Doktuz",
            errorMessage: "Cargando...",
            defaultLocationDoktuz: true,
        }
        this._loadCurrentPosition();
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <MapView style={styles.mapStyle}
                    region={this.state.mapData}>
                    <Marker
                        coordinate={this.state.markerData}
                    />
                </MapView>
                <View style={{backgroundColor:'#fff', position:'absolute',width:'100%',bottom:0}}>
                    <View style={{ marginLeft: 15, marginRight:10}}>
                        <View style={{marginVertical:15}}>
                            <Text>
                                Dirección Actual: 
                                {   
                                    this.state.errorMessage === "Cargando..." ?
                                    <ActivityIndicator style={{marginRight: 15}} size="small" color="#ff8984"/>
                                    : <Text>{this.state.geocodeText}</Text>
                                }
                            </Text>
                            <Text style={{color: "#ff8984", marginTop: 5}}>{this.state.errorMessage}</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.requestAttentionBtn} onPress={this._createRequest}>
                            <Text style={styles.requestAttentionText}>Registrar solicitud</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    getGeocodeAsync = async (location) => {
        let geocode = await Location.reverseGeocodeAsync(location)
        let geocodeToText = String([geocode[0].postalCode]) + " " 
        + String([geocode[0].street]) + ", " + String([geocode[0].city]) + ", "
        + String([geocode[0].region]) + "/" + String([geocode[0].country]);
        this.setState({ geocodeText: geocodeToText});
    }

    _createRequest = async () => {
        fetch(`http://devapi.doktuz.com:8080/goambu/api/clients/${this.props.route.params.clientId}/request-attention?organization_id=1`, {
            method: 'POST',
            body: JSON.stringify({
                "location": {
                    "coordinates": [
                      this.state.markerData.latitude,
                      this.state.markerData.longitude
                    ]
                },
                "reference": this.state.geocodeText,
                "cost": 0,
                "clientId": this.props.route.params.clientId,
                "organizationId": "1",//this is for default in the pdf
                "confirmReason": "string",
                "attentionType": "string",
                "preorderId": "string",
                "payment": "string",
                "attentionSubType": "string",
                "createdBy": Platform.OS,
                "scheduledDate": 0,
                "leadChannel": "string",
                "patientsId": [
                    "string"
                ],
                "channel": "string",
                "source": "string",
                "medium": "string",
                "feeComisionWorker": 0,
                "countAttention": 0,
                "year": "string",
                "month": "string",
                "suspect": true,
                "clientDataDokbot": {
                    "size": 0,
                    "weight": 0,
                    "dokbotType": "string"
                },
                "tokenChat": "string",
                "userMessageCulqi": "string",
                "merchantMessageculqi": "string"
            }),
            headers: {
            "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(responseData => {
            alert("Tu solicitud ha sido recibida y su estado es: " + responseData.currentStatus);
        })      
        .catch(error => {
            alert("No hemos podido procesar tu solicitud. \/nError: " + error);
        })
    }

    _loadCurrentPosition = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
 
        if (status !== 'granted') {
            this.setState({
              errorMessage: '*(Se denegó el acceso a tu ubicación.)',
              defaultLocationDoktuz: false
            });
        } else {
            let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
            this.setState({ 
                markerData: {
                    latitude: location.coords.latitude, 
                    longitude: location.coords.longitude
                },
                mapData: {
                    latitude: location.coords.latitude, 
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            });
            await this.getGeocodeAsync(this.state.markerData);
            this.setState({ 
                errorMessage: "",
                defaultLocationDoktuz: true
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    requestAttentionBtn: {
        width: '80%',
        backgroundColor: "#ff8984",
        borderRadius: 20,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    requestAttentionText: {
        color: "#fff",
        fontSize: 16
    }
});