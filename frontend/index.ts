import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

// Don't import react-native-screens at all to avoid native screen issues
// import { enableScreens } from 'react-native-screens';
// enableScreens(false);

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
