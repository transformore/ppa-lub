import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {darkTheme} from '../styles';
import {Provider as PaperProvider} from 'react-native-paper';
import React, {Component} from 'react';
import {StatusBar, View, Text} from 'react-native';

import {
  LoginPage,
  HomeScreen,
  AuthLoadingScreen,
  HazardTest,
  AttendanceScreen,
  Absensi,
  PreUseCheckScreen,
  ChangePasswordScreen,
  MedicalClaimScreen,
  MedicalClaimEntryScreen,
  MedicalClaimStagingScreen,
  SayaPeduliPage,
  SelectUnitPage,
  LeavingEntryScreen,
  LeavingScreen,
  HmOptScreen,
  BreakdownScreen,
  FitToWorkScreen,
  ApprovalScreen,
  ApprovalScreenP2h,
  LubScreen,
  LubHistoryScreen,
} from '../screens';
import {MenuContents} from '../components';

const Stack = createStackNavigator();
class NewNavigator extends Component {
  render() {
    return (
      <PaperProvider theme={darkTheme}>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          translucent={false}
        />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="AuthLoading">
            <Stack.Screen
              name="AuthLoading"
              component={AuthLoadingScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              // component={HomePage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Menu"
              component={MenuContents}
              // component={HomePage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Absen"
              component={AttendanceScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AbsenTest"
              component={Absensi}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SelectUnit"
              component={SelectUnitPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PreUse"
              component={PreUseCheckScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Hazard"
              component={HazardTest}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SayaPeduli"
              component={SayaPeduliPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Medical"
              // component={MedicalTest}
              component={MedicalClaimScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MedicalStaging"
              component={MedicalClaimStagingScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MedicalEntry"
              component={MedicalClaimEntryScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="LeavingForm"
              component={LeavingEntryScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Leaving"
              component={LeavingScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Hourmeter"
              component={HmOptScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Lub"
              component={LubScreen}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="LubHistory"
              component={LubHistoryScreen}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="Breakdown"
              component={BreakdownScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="FitToWork"
              component={FitToWorkScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Approval"
              component={ApprovalScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ApprovalP2h"
              component={ApprovalScreenP2h}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  }
}
export default NewNavigator;
