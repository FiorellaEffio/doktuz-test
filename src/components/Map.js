import React from 'react';
import {Platform, Text, StyleSheet, Dimensions, AsyncStorage, Button, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

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
            geocode:null,
            errorMessage:""
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
                    <View style={{marginTop: 10, marginLeft: 15, marginRight:10}}>
                        <View>
                            <Text>Mueve el pin para seleccionar el lugar</Text>
                        </View>
                        <View style={{marginTop:5}}>
                            <Text style={styles.heading1}>
                                {this.state.geocode  ? `${this.state.geocode[0].city}, 
                                ${this.state.geocode[0].isoCountryCode}` :""},
                                {this.state.geocode ? this.state.geocode[0].street :""},
                            </Text>
                            <Text>
                                Error: {this.state.errorMessage}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity onPress={this._createRequest}>
                            <Text>Registrar solicitud</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    getGeocodeAsync = async (location) => {
        let geocode = await Location.reverseGeocodeAsync(location)
        console.log(geocode);
        this.setState({ geocode})
    }

    _createRequest = async () => {
        let geocodeToText = String([this.state.geocode[0].postalCode]) + " " 
            + String([this.state.geocode[0].street]) + ", " 
            + String([this.state.geocode[0].city]) + ", "
            + String([this.state.geocode[0].region]) + "/" + String([this.state.geocode[0].country]);
        console.log(geocodeToText);
        fetch(`http://devapi.doktuz.com:8080/goambu/api/clients/${this.props.route.params.clientId}/request-attention?organization_id=1`, {
            method: 'POST',
            body: JSON.stringify({
                "location": {
                    "coordinates": [
                      this.state.markerData.latitude,
                      this.state.markerData.longitude
                    ]
                },
                "reference": geocodeToText,
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
            console.log(responseData);
            alert("Tu solicitud ha sido recibida y su estado es: " + responseData.currentStatus);
            // this.setState({
            //     attentionList: responseData,
            //     loading: false
            // });
        })      
        .catch(error => {
            alert("No hemos podido procesar tu solicitud. \/nError: " + error);
        })
    }

    _loadCurrentPosition = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
        }
    
        let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
        console.log(location);
        const { latitude , longitude } = location.coords
        this.getGeocodeAsync({latitude, longitude})
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
});