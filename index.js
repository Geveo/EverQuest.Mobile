import 'react-native-url-polyfill/auto';
import { decode } from "base-64";
import { registerRootComponent } from 'expo';
import 'react-native-get-random-values'
import App from './app/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
global.atob = decode; // polyfill for jwt decode
registerRootComponent(App);

