import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomePage from './HomePage';
import LoginPage from './LoginPage';

const MainNavigator = createStackNavigator({
  Login: {screen: LoginPage},
  Home: {screen: HomePage},
});

const App = createAppContainer(MainNavigator);

export default App;

