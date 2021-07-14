import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AppContext} from '../context';
import {ActivityIndicator, Colors} from 'react-native-paper';

import axios from 'axios';

// import React, {Component} from 'react';
// import {View, Text} from 'react-native';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.bootstrapAsync();
  }

  // componentDidMount() {
  //   this.context.setMAC();
  // }

  bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const siteId = await AsyncStorage.getItem('siteId');
    const isPublicNetwork = await AsyncStorage.getItem('isPublicNetwork');

    if (
      (await userToken) &&
      (await siteId) &&
      (await isPublicNetwork) != null
    ) {
      this.getDataAsync();
    } else {
      // this.props.navigation.navigate('Login');
      this.props.navigation.replace('Login');
    }
  };

  getDataAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const siteId = await AsyncStorage.getItem('siteId');
    const isPublicNetwork = JSON.parse(
      await AsyncStorage.getItem('isPublicNetwork'),
    );

    await this.context.setSite(await +siteId);
    await this.context.setNetwork(await isPublicNetwork);
    await this.context.setBaseUrl(siteId, isPublicNetwork);

    await axios
      .post('/validate', {
        token: await userToken,
      })
      .then((response) => {
        this.context.setUserData(
          response.data.data.nrp,
          response.data.data.nama,
          response.data.data.dept,
          response.data.data.jabatan,
          response.data.data.posisi,
          response.data.data.empl_subgroup,
          response.data.data.tglLahir,
          response.data.data.maritalStatus,
          response.data.data.email,
          response.data.data.noHp,
          response.data.data.npwp,
          response.data.data.golDar,
          response.data.data.bpjs_tk,
          response.data.data.bpjs_ks,
          response.data.data.exp_mcu,
          response.data.data.exp_simper,
          response.data.data.exp_simpol,
          response.data.data.exp_permit,
          response.data.data.simpol,
          response.data.data.keluarga,
        );

        // alert(JSON.stringify(this.context.userData.simpol));

        // this.props.navigation.navigate('Home');
        this.props.navigation.replace('Home');
      })
      .catch((error) => {
        this.logoutAsync();
      });
  };

  logoutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  render() {
    return (
      <Fragment>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={'transparent'}
          translucent={true}
        />
        <SafeAreaView style={styles.areaaman}>
          <View style={styles.endflex}>
            <Image
              style={styles.logo}
              source={require('../assets/image/logo.png')}
            />
          </View>
          <View style={styles.areaaman} />
          <View style={styles.container}>
            <View style={styles.container}>
              <ActivityIndicator
                animating
                size={'large'}
                color={Colors.red500}
              />
            </View>
            <Text>Loading...</Text>
            <View style={styles.areaaman} />
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endflex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  areaaman: {
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
AuthLoadingScreen.contextType = AppContext;
export default AuthLoadingScreen;
