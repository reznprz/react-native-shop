import '@expo/metro-runtime';
import 'react-native-gesture-handler';   // optional for web, required on native
import App from './App';
import { registerRootComponent } from 'expo';

registerRootComponent(App);
