import React from 'react';
import {StyleSheet, Button, ActivityIndicator, AsyncStorage, StatusBar, Text, TouchableOpacity, View, TextInput} from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';

const userInfo = {username: 'admin', password: '12345'};

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {username:'',password:''}
  }

  static navigationOptions = {
    header: null
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
    if(userInfo.username === this.state.username && userInfo.password === this.state.password) {
      await AsyncStorage.setItem('logged', '1');
      this.props.navigation.navigate('App');
    } else {
      alert('Username or Password wrong');
    }
  }

}

class HomeScreen extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>
          welcome Logged Page
        </Text>
        <Button onPress={this._logout} title="Logout"/>
      </View>
    );
  }

  _logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }
}

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._loadData();
  }
  render() {
    return(
      <View style={styles.container}>
        <ActivityIndicator/>
        <StatusBar barStyle="default"/>
      </View>
    );
  }
  _loadData = async () => {
    const logged = await AsyncStorage.getItem('logged');
    this.props.navigation.navigate(logged !== '1' ? 'Auth' : 'App');
  }
}

const AppStack = createStackNavigator({Home: HomeScreen});
const AuthStack = createStackNavigator({Login: LoginScreen})

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: 'Auth'
    }
  )
)

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