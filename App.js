import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import LoginScreen from './src/screens/Login'
import HomeScreen from './src/screens/Home'
import AuthLoadingScreen from './src/screens/AuthLoading'

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