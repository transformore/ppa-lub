// import {darkTheme} from './src/styles';
// import {Provider as PaperProvider} from 'react-native-paper';
// import {LoginPage, HomeScreen} from './src/screens';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  View,
  Text,
} from 'react-native';
// import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
// import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {AppProvider} from './src/context';
import {NewNavigator} from './src/navigators';
import {HomePage} from './src/screens';

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Sending...']);

export default function App() {
  return (
    <AppProvider>
      <NewNavigator />
      {/* <HomePage /> */}
    </AppProvider>
  );
}
