import React from 'react';
import {Text, StyleSheet, Dimensions, AsyncStorage, Button, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { TextInput } from 'react-native-gesture-handler';
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
                            <TextInput  style={{borderColor: '#52cad6', borderWidth:2, borderRadius:5,marginTop:4, height:45}}/>
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
                </View>
            </View>
        );
    }

    getGeocodeAsync = async (location) => {
        let geocode = await Location.reverseGeocodeAsync(location)
        console.log(geocode);
        this.setState({ geocode})
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