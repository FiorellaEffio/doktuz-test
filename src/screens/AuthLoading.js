import React from 'react';
import {StyleSheet, ActivityIndicator, AsyncStorage, StatusBar, View} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
})