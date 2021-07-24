import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  StatusBar,
  Keyboard,
  SafeAreaView,
  Image,
  TouchableNativeFeedback,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  // TextInput,
  Button,
  Snackbar,
  Divider,
  Colors,
  Portal,
  Dialog,
  List,
  Switch,
} from 'react-native-paper';
import axios from 'axios';
import {site} from '../constants';
import {AppContext} from '../context';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
// import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Icon from 'react-native-vector-icons/FontAwesome';
const {width, height} = Dimensions.get('screen');

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nrp: '',
      password: '',
      loading: false,
      loginMessageVisible: false,
      loginMessage: '',
      siteDialogVisible: false,
    };
  }

  login = () => {
    this.setState({loading: true});
    // this.context.setApprovalUpdate(true);

    if (!this.state.nrp) {
      this.setState({
        loginMessage: 'NRP empty',
        loginMessageVisible: true,
        loading: false,
      });
    } else if (this.context.siteId == null) {
      this.setState({
        loginMessage: 'Site empty',
        loginMessageVisible: true,
        loading: false,
      });
    } else if (this.context.isPublicNetwork == null) {
      this.setState({
        loginMessage: 'Network type empty',
        loginMessageVisible: true,
        loading: false,
      });
    } else {
      Keyboard.dismiss();

      this.context.setBaseUrl(
        this.context.siteId,
        this.context.isPublicNetwork,
      );

      NetInfo.fetch().then((state) => {
        // alert(state.isConnected);
        if (state.isConnected === true) {
          axios
            // .post(`/login`, {
            .post('/integratedLogin', {
              nrp: this.state.nrp,
              password: this.state.password,
              app_version: this.context.app_version,
              // mac: this.context.mac,
            })
            .then((response) => {
              this.loginAsync(response.data.token);
              this.context.setLoggedIn(true);
            })
            .catch((error) => {
              console.warn(JSON.stringify(error));
              if (error.response) {
                if (error.response.status === 401) {
                  this.setState({
                    loginMessageVisible: true,
                    loginMessage: error.response.data.message,
                    loading: false,
                    nrp: '',
                    password: '',
                  });
                }
                return;
              }
              this.setState({
                loginMessageVisible: true,
                loginMessage: 'Ups.. something went wrong',
                loading: false,
                nrp: '',
                password: '',
              });
            });
        } else {
          this.setState({
            loginMessage: 'Connection problem',
            loginMessageVisible: true,
            loading: false,
          });
        }
      });
    }
  };

  loginAsync = async (token) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('siteId', this.context.siteId.toString());
    await AsyncStorage.setItem(
      'isPublicNetwork',
      this.context.isPublicNetwork.toString(),
    );
    // await this.props.navigation.navigate('AuthLoading');
    await this.props.navigation.replace('AuthLoading');
  };

  showSiteDialog = () => this.setState({siteDialogVisible: true});
  hideSiteDialog = () => this.setState({siteDialogVisible: false});

  render() {
    return (
      <Fragment>
        <StatusBar
          // barStyle="dark-content"
          hidden={false}
          backgroundColor={'#f5f6fa'}
          translucent={false}
        />
        <SafeAreaView
          style={{
            backgroundColor: '#f5f6fa',
            justifyContent: 'center',
          }}>
          <ScrollView style={{backgroundColor: 'transparent'}}>
            <View
              style={{
                margin: 10,
                backgroundColor: Colors.clear,
              }}>
              <View
                style={{
                  marginTop: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    height: 50,
                    width: 50,
                    resizeMode: 'contain',
                  }}
                  source={require('../assets/image/logoppa.png')}
                />
                <View
                  style={{
                    marginLeft: 10,
                    marginBottom: 5,
                  }}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: 15,
                  marginBottom: 20,
                }}>
                <Text style={{fontSize: 35, fontWeight: 'bold'}}>PPA</Text>
                <Text style={styles.logo}>Oil&Grease</Text>
              </View>
              <View style={{zIndex: 2}}>
                <TouchableNativeFeedback
                  delayPressIn={0}
                  background={TouchableNativeFeedback.Ripple(Colors.green200)}
                  onPress={() => {
                    this.showSiteDialog();
                    Keyboard.dismiss();
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      borderRadius: 25,
                      paddingLeft: 30,
                      marginHorizontal: 50,
                      marginTop: 20,
                      marginBottom: 10,
                      height: 50,
                      flexDirection: 'row',
                      // backgroundColor: '#F4F4F4',
                      backgroundColor: 'white',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        textAlign: 'center',
                        fontFamily: 'fontisto',
                        color: 'grey',
                      }}>
                      {this.context.siteId != null ? 'SITE  ' : 'SITE  '}
                    </Text>
                    <Text style={{fontSize: 18, color: 'grey'}}>
                      {this.context.siteId != null
                        ? site[this.context.siteId].name
                        : ''}
                    </Text>
                  </View>
                </TouchableNativeFeedback>

                <TextInput
                  style={{
                    marginHorizontal: 50,
                    marginBottom: 10,
                    height: 50,
                    backgroundColor: Colors.white,
                    borderRadius: 25,
                    fontSize: 18,
                    paddingLeft: 30,
                  }}
                  mode="flat"
                  label="NRP"
                  value={this.state.nrp}
                  onChangeText={(text) => this.setState({nrp: text})}
                  keyboardType={'numeric'}
                  placeholder={'NRP'}
                />
                <TextInput
                  secureTextEntry
                  style={{
                    marginHorizontal: 50,
                    marginBottom: 10,
                    height: 50,
                    backgroundColor: Colors.white,
                    borderRadius: 25,
                    paddingLeft: 30,
                  }}
                  mode="flat"
                  label="PASSWORD"
                  value={this.state.password}
                  onChangeText={(text) => this.setState({password: text})}
                  // keyboardType={"numeric"}
                  keyboardType={'default'}
                  placeholder={'PASSWORD'}
                />

                <List.Item
                  title="Network Status"
                  description={`Current network: ${
                    this.context.isPublicNetwork ? 'Public' : 'Local'
                  }`}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      style={{marginLeft: 0}}
                      icon={'wifi'}
                    />
                  )}
                  right={() => (
                    <Switch
                      value={this.context.isPublicNetwork}
                      onValueChange={() =>
                        this.context.setNetwork(!this.context.isPublicNetwork)
                      }
                    />
                  )}
                  style={{
                    // margin: 0,
                    padding: 0,
                    marginHorizontal: 40,
                    marginTop: 10,
                  }}
                />

                <Button
                  loading={this.state.loading}
                  dark
                  // color={colors.primary}
                  mode="contained"
                  onPress={this.login}
                  style={{
                    width: 260,
                    marginHorizontal: 50,
                    marginTop: 20,
                    paddingVertical: 8,
                    fontSize: 25,
                    borderRadius: 28,
                    backgroundColor: '#F79F1F',
                    alignSelf: 'center',
                  }}>
                  Login
                </Button>
              </View>
              <View
                style={{
                  width: width - 20,
                  height: 70,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{
                    color: Colors.grey500,
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  Ver {this.context.app_version}
                </Text>
              </View>
            </View>
            <View style={{height: 500, backgroundColor: 'grey300'}} />
          </ScrollView>
          <Portal>
            <Dialog
              visible={this.state.siteDialogVisible}
              onDismiss={this.hideSiteDialog}>
              <View>
                {/* <ScrollView keyboardShouldPersistTaps={'always'}> */}
                <FlatList
                  keyboardShouldPersistTaps={'always'}
                  // style={{ backgroundColor: background }}
                  data={site}
                  renderItem={({item, index}) => (
                    <List.Item
                      title={item.name}
                      onPress={() => {
                        this.context.setSite(index);
                        this.hideSiteDialog();
                      }}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={Divider}
                />
                {/* </ScrollView> */}
              </View>
              <Divider />
              <Dialog.Actions>
                <Button color={'#000000'} onPress={this.hideSiteDialog}>
                  Cancel
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

          <Snackbar
            visible={this.state.loginMessageVisible}
            onDismiss={() => this.setState({loginMessageVisible: false})}
            action={{
              label: 'Close',
              onPress: () => null,
            }}>
            {this.state.loginMessage}
          </Snackbar>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    marginTop: 0,
    color: '#1F4068',
    fontSize: 40,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Cookie-Regular',
    // fontFamily: 'Engagement-Regular',
  },
});

LoginPage.contextType = AppContext;
export default LoginPage;
