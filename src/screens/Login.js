import React from 'react';
import { Platform, StyleSheet, AsyncStorage, Text, TouchableOpacity, View, TextInput} from 'react-native';

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {username:'',password:''}
  }

  static navigationOptions = {
    headerShown: false
  };
  
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>Login</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Correo Electronico"
          onChangeText={(username)=>this.setState({username})}
          value={this.state.username}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Contrasena"
          secureTextEntry={true}
          onChangeText={(password)=>this.setState({password})}
          value={this.state.password}
        />
        <TouchableOpacity onPress={this._signin} style={styles.btnEnter}>
          <Text style={{color: '#fff'}}>Iniciar Sesion</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _signin = async () => {
    fetch(`http://devapi.doktuz.com:8080/goambu/api/auth?mobilePlatform=${Platform.OS}`, {
        method: 'POST',
        body: JSON.stringify({
            "username": this.state.username,
            "password": this.state.password
        }),
        headers: {
        "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(responseData => {
        if(responseData.message == null) {
            (async () => {
                await AsyncStorage.setItem('logged', '1');
                await AsyncStorage.setItem('userId', responseData.id);
                this.props.navigation.navigate('App');
            })();
        } else {
            alert('Username or Password wrong');
        }
    })
    .catch(error => {
        alert(error);
    })
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
    input: {
        margin: 15,
        height: 40,
        padding: 5,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#428af8'
    },
    btnEnter: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#095a95',
        marginHorizontal: 20,
        borderRadius: 25,
        height: 50,
    }
})