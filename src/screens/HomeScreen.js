import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from 'react-native';
import {
  Colors,
  FAB,
  Avatar,
  Divider,
  Button,
  List,
  Title,
  Caption,
  Snackbar,
  ActivityIndicator,
  Appbar,
} from 'react-native-paper';

import Dialog from 'react-native-dialog';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Ikon from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import {AppContext} from '../context';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import Modal from 'react-native-modal';
import {site} from '../constants';
import {
  ImageMenuItem,
  HomeCarousel,
  HmStartDialog,
  BlinkingText,
} from '../components';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const {width, height} = Dimensions.get('screen');
const profile_height = height / 11;
const rbSheetItem = 4;

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unit: '',
      confirmCheckOutDialogVisible: false,
      hmStartDialogVisible: false,
      hmStopDialogVisible: false,
      parkingLocationDialogVisible: false,
      snackbarVisible: false,
      snackbarMsg: null,
      hmStart: null,
      hmStop: null,
      parkingLocation: null,
      isProfileImageError: false,
      isMenuSheetOpen: false,
      isSapSheetOpen: false,
      isEssSheetOpen: false,
      isMeSheetOpen: false,
      sheetContentsHeight: null,
      sheetContentsWidth: null,
      sheetOpenId: null,
      approvalOutstand: 0,
      approvalOutstandP2h: 0,
      timer: null,
      timer2: null,
      anggota_klg: [],
    };
  }

  componentDidMount() {
    {
      this.context.userData.empl_subgroup < 5
        ? this._updateApprovalist()
        : null;
    }
    this.context.getStatus();
    this.context.updateCheckInHistory();
    setTimeout(() => {
      this.checkLastReport();
    }, 10000);
  }

  // componentWillUnmount() {
  //   clearInterval(this.state.timer);
  // }

  checkLastReport = async () => {
    const lastActivityReport = JSON.parse(
      await AsyncStorage.getItem('lastActivityReport'),
    );

    if (await lastActivityReport) {
      const time = await lastActivityReport.time;
      const interval = await lastActivityReport.interval;

      const dateNow = new Date();
      let dateLast = new Date(time);
      dateLast.setMinutes(dateLast.getMinutes() + +interval);
      if (dateNow >= dateLast) {
        if (!this.state.reportWarnDialogVisible) {
          this.showReportWarnDialogVisible();
        }
      }
    } else {
      this._updateApprovalist();
      this.context.getStatus();
      this.context.updateCheckInHistory();
    }
  };

  logoutAsync = async () => {
    await AsyncStorage.clear();
    this.context.setLoggedIn(false);
    this.context.clearUserData();
    this.context.setLoggedIn(false);
    this.RBSheet2.close();
    this.props.navigation.replace('Login');
  };

  _setUnit = (val) => this.setState({unit: val});

  _setApprovalOutstand = (approvalOutstand) => {
    this.setState({
      approvalOutstand: approvalOutstand,
    });
  };

  _setApprovalOutstandP2h = (approvalOutstandP2h) => {
    this.setState({
      approvalOutstandP2h: approvalOutstandP2h,
    });
  };

  _updateApprovalist = () => {
    axios
      .get(`/outstandingApproval/${this.context.userData.nrp}`)
      .then((res) => {
        this._setApprovalOutstand(res.data.rabs);
        this._setApprovalOutstandP2h(res.data.p2h);
      });
  };

  // _updateApprovalistP2h = () => {
  //   axios
  //     .get(`/waitingApprovalP2h/${this.context.userData.nrp}`)
  //     .then((res) => {
  //       this._setApprovalOutstandP2h(res.data.outstanding);
  //     });
  //   // alert('revisi p2h updated!!');
  // };

  _openUnitScanner() {
    var that = this;
    //To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Refueling App Camera Permission',
              message: 'Refueling App needs access to your camera ',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
            that.setState({unit: ''});
            that.props.navigation.navigate('CheckIn', {
              setUnit: that._setUnit,
            });
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      //Calling the camera permission function
      requestCameraPermission();
    } else {
      that.setState({unit: ''});
      that.props.navigation.navigate('CheckIn', {
        setUnit: that._setUnit,
      });
    }
  }

  _openUnitSelect = () => {
    this.props.navigation.navigate('SelectUnit');
  };

  showConfirmCheckOutDialog = () => {
    // this.setState({ confirmCheckOutDialogVisible: true });
    Alert.alert(
      'Check Out Confirmation',
      `You will be checked out from unit with code number: ${this.context.status.unit}`,
      [
        // {
        //   text: "Ask me later",
        //   onPress: () => console.log("Ask me later pressed")
        // },
        {text: 'Confirm', onPress: () => this.context.checkOut()},
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  hideConfirmCheckOutDialog = () => {
    this.setState({confirmCheckOutDialogVisible: false});
  };

  showHmStartDialog = () => {
    // this.setState({hmStartDialogVisible: true});
    this.setState(
      {
        hmStartDialogVisible: false,
      },
      () => {
        setTimeout(() => {
          this.setState({
            hmStartDialogVisible: true,
          });
        }, 200);
      },
    );
  };

  hideHmStartDialog = () => {
    this.setState({hmStartDialogVisible: false});
  };

  showHmStopDialog = () => {
    // this.setState({hmStopDialogVisible: true});
    this.setState(
      {
        hmStopDialogVisible: false,
      },
      () => {
        // const timer3 = setTimeout(() => {
        setTimeout(() => {
          this.setState({
            hmStopDialogVisible: true,
          });
        }, 200);
        // this.setState({timer2});
      },
    );
  };

  hideHmStopDialog = () => {
    // this.setState({hmStopDialogVisible: false});
    this.setState(
      {
        hmStopDialogVisible: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            hmStopDialogVisible: false,
          });
        }, 200);
      },
    );
  };

  showParkingLocationDialog = () => {
    this.setState({parkingLocationDialogVisible: true});
  };

  hideParkingLocationDialog = () => {
    this.setState({parkingLocationDialogVisible: false});
  };

  confirmHmStart = () => {
    const hmStart =
      this.state.hmStart == null
        ? this.context.status.lastHm
        : this.state.hmStart;
    if (+hmStart < +this.context.status.lastHm) {
      this.showSnackbar('Input tidak valid');
    } else {
      this.hideHmStartDialog();

      this.context.setLoading(true);

      axios
        .put('/hmStart', {
          nrp: this.context.userData.nrp,
          unit: this.context.status.unit,
          hm:
            this.state.hmStart == null
              ? this.context.status.lastHm
              : this.state.hmStart,
        })
        .then((response) => {
          this.context.setLoading(false);
          if (response.data.kode === 1) {
            this.context.getStatus();
          } else {
            this.showSnackbar(response.data.hasil);
          }
        })
        .catch((error) => {
          this.context.setLoading(false);

          Alert.alert(
            'Update HM Start Gagal',
            'Terjadi kesalahan:' + error,
            [{text: 'OK', onPress: () => null}],
            {cancelable: false},
          );
        });
    }
  };

  confirmHmStop = () => {
    const hmStop = this.state.hmStop == null ? 0 : this.state.hmStop;
    if (+hmStop < +this.context.status.hmStart) {
      this.showSnackbar('Input tidak valid');
      Keyboard.dismiss();
    } else if (
      this.state.parkingLocation == null ||
      this.state.parkingLocation.length < 4
    ) {
      this.showSnackbar('Isikan lokasi parkir');
    } else {
      this.hideHmStopDialog();
      this.context.setLoading(true);

      axios
        .put('/hmStop', {
          nrp: this.context.userData.nrp,
          unit: this.context.status.unit,
          hm: this.state.hmStop,
          lokasi: this.state.parkingLocation,
        })
        .then((response) => {
          this.context.setLoading(false);
          this.context.getStatus();

          // if (response.data.kode === 1) {
          //   this.context.getStatus();
          // } else {
          //   this.showSnackbar(response.data.hasil);
          // }
        })
        .catch((error) => {
          this.context.setLoading(false);

          Alert.alert(
            'Update HM Stop Gagal',
            'Terjadi kesalahan:' + error,
            [{text: 'OK', onPress: () => null}],
            {cancelable: false},
          );
        });
    }
  };

  confirmParkingLocation = () => {
    if (this.state.parkingLocation == null) {
      this.showSnackbar('Input tidak boleh kosong');
    } else if (this.state.parkingLocation.length < 4) {
      this.showSnackbar('Input tidak valid');
    } else {
      this.hideParkingLocationDialog();
      this.context.setLoading(true);

      axios
        .put('/parkingLocation', {
          nrp: this.context.userData.nrp,
          cn: this.context.status.unit,
          lokasi: this.state.parkingLocation,
        })
        .then((response) => {
          this.context.setLoading(false);
          if (response.data.status == 1) {
            this.context.getStatus();
          } else {
            this.showSnackbar(response.data.message);
          }
        })
        .catch((error) => {
          this.context.setLoading(false);
          alert(error);
        });
    }
  };

  showSnackbar = (msg) => {
    this.setState({snackbarVisible: true, snackbarMsg: msg});
  };

  hideSnackbar = () => {
    this.setState({snackbarVisible: false, snackbarMsg: null});
  };

  onLayout = (event) => {
    if (this.state.sheetContentsHeight) {
      return;
    } // layout was already called

    // let {width, height} = event.nativeEvent.layout;
    this.setState({
      sheetContentsHeight:
        height > Dimensions.get('window').height - StatusBar.currentHeight
          ? Dimensions.get('window').height - StatusBar.currentHeight
          : height,
      sheetContentsWidth:
        width > Dimensions.get('window').width
          ? Dimensions.get('window').width
          : width,
    });
  };
  render() {
    const menuData = [
      {
        label: 'Formulir P2H',
        onPress: () => this.props.navigation.navigate('PreUse'),
        image: require('../assets/image/menu/preusecheck3D.png'),
        elevation: 3,
        isOprOnly: false,
      },
      {
        label: 'Minta Perbaikan',
        onPress: () => this.props.navigation.navigate('Breakdown'),
        image: require('../assets/image/menu/repair3D.png'),
        isOprOnly: false,
      },
      {
        label: 'Catatan HM',
        onPress: () => this.props.navigation.navigate('Hourmeter'),
        image: require('../assets/image/menu/hourmeter3D.png'),
        isOprOnly: false,
      },
      {
        label: 'Oil & Grease',
        onPress: () => this.props.navigation.navigate('LubHistory'),
        image: require('../assets/image/menu/hourmeter3D.png'),
        isOprOnly: false,
      },
      {
        label:
          this.context.status.isCheckedIn && !this.context.status.isNonOpr
            ? this.context.status.hmStart == null
              ? 'Mulai Operasi'
              : this.context.status.hmStop == null &&
                this.context.status.hmStart != null
              ? 'Stop Operasi'
              : 'Mulai Operasi'
            : 'Mulai Operasi',
        onPress: () =>
          this.context.status.isCheckedIn && !this.context.status.isNonOpr
            ? this.context.status.hmStart == null
              ? this.showHmStartDialog()
              : this.context.status.hmStop == null &&
                this.context.status.hmStart != null
              ? this.showHmStopDialog()
              : alert('isi parking location terlebih dahulu')
            : alert('check in terlebih dahulu'),
        image: require('../assets/image/menu/stop3D.png'),
        isOprOnly: true,
      },
    ];
    const essData = [
      {
        label: 'Catatan Kehadiran',
        onPress: () => this.props.navigation.navigate('AbsenTest'),
        image: require('../assets/image/menu/hadir3D.png'),
        isOprOnly: false,
      },
      // {
      //   label: 'Catatan HM',
      //   onPress: () => this.props.navigation.navigate('Hourmeter'),
      //   image: require('../assets/image/menu/hourmeter3D.png'),
      //   isOprOnly: false,
      // },
      {
        label: 'Pengajuan Cuti',
        onPress: () => this.props.navigation.navigate('Leaving'),
        image: require('../assets/image/menu/leave3D.png'),
        isOprOnly: false,
      },
      {
        label: 'Benefit Claim',
        onPress: () => this.props.navigation.navigate('Medical'),
        image: require('../assets/image/menu/medic.png'),
        isOprOnly: false,
      },
    ];
    const sapData = [
      {
        label: 'Saya Peduli',
        // onPress: () => this.props.navigation.navigate("Breakdown"),
        onPress: () => this.props.navigation.navigate('SayaPeduli'),
        image: require('../assets/image/menu/care.png'),
        isOprOnly: false,
      },
      {
        label: 'Laporkan Bahaya',
        onPress: () => this.props.navigation.navigate('Hazard'),
        // onPress: () => alert("tes"),
        image: require('../assets/image/menu/hazard3D.png'),
        isOprOnly: false,
      },
    ];

    const MenuButton = () => {
      return (
        <Icons.Button
          color={'#222f3e'}
          // color="white"
          size={23}
          backgroundColor="transparent"
          marginLeft={10}
          name="bulldozer"
          // name="calendar"
          onPress={() => {
            this.setState({isMenuSheetOpen: true});
            // this.setState({sheetOpenId:1})
            this.RBSheet.open();
          }}
        />
      );
    };
    const UserButton = () => {
      return (
        <Ikon.Button
          color={'#222f3e'}
          size={23}
          backgroundColor="transparent"
          marginLeft={6}
          name="user"
          onPress={() => {
            this.setState({isMeSheetOpen: true});
            // this.setState({ sheetOpenId: 0 });
            this.RBSheet2.open();
          }}>
          {/* Me */}
        </Ikon.Button>
      );
    };
    const EssButton = () => {
      return (
        <Icon.Button
          color={'#222f3e'}
          size={23}
          backgroundColor="transparent"
          marginLeft={6}
          name="cart-outline"
          onPress={() => {
            this.setState({isEssSheetOpen: true});
            // this.setState({ sheetOpenId: 0 });
            this.RBSheet4.open();
          }}>
          {/* Me */}
        </Icon.Button>
      );
    };
    const SapButton = () => {
      return (
        <Icons.Button
          color={'#222f3e'}
          size={23}
          backgroundColor="transparent"
          marginLeft={10}
          name="target"
          onPress={() => {
            this.setState({isSapSheetOpen: true});
            // this.setState({ sheetOpenId: 0 });
            this.RBSheet3.open();
          }}>
          {/* SAP */}
        </Icons.Button>
      );
    };
    return (
      <Fragment>
        {/* <Appbar.Header>
          <Appbar.BackAction onPress={null} />
          <Appbar.Content title="Title" subtitle="Subtitle" />
          <Appbar.Action icon="magnify" onPress={null} />
          <Appbar.Action icon="dots-vertical" onPress={null} />
        </Appbar.Header> */}
        {/* <ScrollView> */}
        <SafeAreaView
          style={{height: windowHeight * 0.91, backgroundColor: '#f5f6fa'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
              height: windowHeight * 0.06,
              backgroundColor: '#f5f6fa',
              // borderWidth: 1,
              // borderColor: 'green',
            }}>
            <View
              style={{
                width: 40,
                borderRadius: 20,
                height: 40,
                marginLeft: 15,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {this.state.isProfileImageError ? (
                <Avatar.Icon
                  size={40}
                  color={Colors.white}
                  theme={{colors: {primary: Colors.grey600}}}
                  icon={({size, color}) => (
                    <Icons
                      name={
                        this.context.status.isCheckedIn
                          ? 'account-check'
                          : 'account'
                      }
                      size={size}
                      color={color}
                    />
                  )}
                  style={{left: 0, top: 0}}
                />
              ) : (
                <Image
                  onError={() => this.setState({isProfileImageError: true})}
                  source={{
                    uri: `${
                      site[this.context.siteId].apiUrl[
                        this.context.isPublicNetwork ? 'public' : 'local'
                      ]
                    }/assets/img/profil/${this.context.userData.nrp}.jpg`,
                  }}
                  style={{
                    // alignItems: "center",
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderColor: 'grey',
                  }}
                />
              )}
            </View>

            <View
              style={{
                flex: 2,
                // marginTop: 15,
                backgroundColor: '#f5f6fa',
                // backgroundColor: 'transparent',
                width: 290,
              }}>
              <Text
                style={{
                  alignSelf: 'flex-start',
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: Colors.blue800,
                  marginLeft: 15,
                  fontFamily: 'Zocial',
                  width: 290,
                }}>
                {this.context.userData.nama}
              </Text>
              <Text
                style={{
                  alignSelf: 'flex-start',
                  fontWeight: 'normal',
                  fontSize: 12,
                  color: Colors.orange700,
                  marginLeft: 15,
                  width: 290,
                }}>
                {this.context.userData.posisi}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              height: windowHeight * 0.32,
              backgroundColor: '#f5f6fa',
              // borderWidth: 1,
              // borderColor: 'green',
            }}>
            <HomeCarousel />
          </View>
          <View
            style={{
              height: windowHeight * 0.26,
              width: windowWidth - 5,
              backgroundColor: '#f5f6fa',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              // borderWidth: 1,
              // borderColor: 'green',
            }}>
            {this.context.checkInHistory.length === 0 ? (
              <Fragment>
                <View
                  style={{
                    marginBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <Icons
                    style={{margin: 10}}
                    name="format-list-checks"
                    size={50}
                    color={Colors.grey400}
                  />
                  <Caption>No Check In History</Caption>
                </View>
              </Fragment>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{backgroundColor: '#f5f6fa'}}>
                <View style={{alignItems: 'center'}}>
                  <View style={{height: 15}} />
                  <Caption style={{fontSize: 15, fontWeight: 'bold'}}>
                    CHECK IN HISTORY
                  </Caption>
                  <View style={{height: 10}} />
                </View>
                <FlatList
                  style={{paddingBottom: 20}}
                  data={this.context.checkInHistory}
                  renderItem={({item, index}) => (
                    <List.Item
                      style={
                        item.status == 0
                          ? {
                              borderRadius: 10,
                              // marginVertical: 5,
                              // borderWidth: 0.5,
                              borderColor: 'grey',
                              width: windowWidth * 0.95,
                              height: 55,
                              alignSelf: 'center',
                              justifyContent: 'center',
                            }
                          : null
                      }
                      title={item.unit}
                      description={`${item.created_date}`}
                      onPress={
                        item.status == 0
                          ? () => {
                              this.context.setLastParkingLocationDialogVisible(
                                true,
                              );
                            }
                          : null
                      }
                      // left={(props) => (
                      //   <List.Icon
                      //     {...props}
                      //     icon={
                      //       item.status == 0
                      //         ? 'check-circle-outline'
                      //         : 'clock-outline'
                      //     }
                      //   />
                      // )}
                      right={(props) => (
                        <List.Icon
                          {...props}
                          color={
                            item.status == 0 ? Colors.grey700 : Colors.grey300
                          }
                          icon="chevron-right"
                        />
                      )}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={Divider}
                />
              </ScrollView>
            )}
          </View>
          <View
            style={{
              height: 80,
              width: windowWidth,
              alignSelf: 'center',
              backgroundColor: '#f5f6fa',
              paddingTop: 10,
              // borderColor: 'green',
              // borderWidth: 1,
            }}>
            {this.state.approvalOutstand == 0 &&
            this.state.approvalOutstandP2h == 0 ? (
              <View
                style={{
                  width: width,
                  height: windowHeight * 0.25,
                  backgroundColor: 'transparent',
                  // backgroundColor: '#f5f6fa',
                }}
              />
            ) : (
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  width: width,
                  backgroundColor: 'transparent',
                  // backgroundColor: '#f5f6fa',
                  height: windowHeight * 0.25,
                }}>
                <Text style={{fontSize: 12, marginBottom: 10}}>
                  Need Approval !
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: windowHeight * 0.04,
                    width: width,
                  }}>
                  {this.state.approvalOutstand == 0 ? (
                    <View>
                      <Text />
                    </View>
                  ) : (
                    <View
                      style={{marginHorizontal: 10, flexDirection: 'column'}}>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('Approval', {
                            goHome: () => this._updateApprovalist(),
                          });
                        }}>
                        <BlinkingText text={this.state.approvalOutstand} />
                      </TouchableOpacity>
                      <Text style={{fontSize: 10}}>Absen</Text>
                    </View>
                  )}
                  {this.state.approvalOutstandP2h == 0 ? (
                    <View>
                      <Text />
                    </View>
                  ) : (
                    <View
                      style={{
                        marginHorizontal: 10,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('ApprovalP2h', {
                            goHome: () => this._updateApprovalist(),
                          });
                        }}>
                        <BlinkingText text={this.state.approvalOutstandP2h} />
                      </TouchableOpacity>
                      <Text style={{fontSize: 10}}>P2H</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
          <View
            style={{
              // backgroundColor: 'green',
              backgroundColor: '#f5f6fa',
              height: windowHeight * 0.08,
              alignI: 'center',
              justifyContent: 'center',
            }}>
            {/* <View style={{backgroundColor: '#f5f6fa'}}> */}
            <FAB
              disabled={
                this.context.isPublicNetwork ||
                (this.context.status.isCheckedIn &&
                  !this.context.status.isNonOpr &&
                  (this.context.status.hmStart == null ||
                    this.context.status.hmStop == null))
              }
              color={Colors.white}
              label={this.context.status.isCheckedIn ? 'Checkout' : 'Checkin'}
              style={{
                width: 150,
                alignSelf: 'center',
                elevation:
                  this.context.isPublicNetwork ||
                  (this.context.status.isCheckedIn &&
                    !this.context.status.isNonOpr &&
                    (this.context.status.hmStart == null ||
                      this.context.status.hmStop == null))
                    ? 0
                    : 3,
              }}
              onPress={() => {
                this.context.status.isCheckedIn
                  ? this.showConfirmCheckOutDialog()
                  : DeviceInfo.getApiLevel() <= 22
                  ? this.props.navigation.navigate('FitToWork')
                  : this.props.navigation.navigate('FitToWork');
              }}
            />
          </View>
          <View style={{flex: 1, backgroundColor: '#f5f6fa'}} />
        </SafeAreaView>
        {/* </ScrollView> */}
        <View>
          <View
            style={{
              // borderWidth: 0.5,
              width: width,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: windowHeight * 0.08,
              backgroundColor: '#f1f2f6',
              // backgroundColor: '#ffc048',
              // zIndex: 1,
              // elevation: 2,
            }}>
            <View
              style={{
                width: width / rbSheetItem,
                height: 37,
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <MenuButton />
              <Text
                style={{
                  fontSize: 9,
                  color: '#222f3e',
                  fontWeight: 'bold',
                  // color: 'white',
                }}>
                OPR
              </Text>
            </View>
            <View
              style={{
                width: width / rbSheetItem,
                height: 37,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <SapButton />
              <Text style={{fontSize: 9, color: '#222f3e', fontWeight: 'bold'}}>
                SAP
              </Text>
            </View>
            <View
              style={{
                width: width / rbSheetItem,
                height: 37,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <EssButton />
              <Text style={{fontSize: 9, color: '#222f3e', fontWeight: 'bold'}}>
                ESS
              </Text>
            </View>
            <View
              style={{
                width: width / rbSheetItem,
                height: 37,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <UserButton />
              <Text style={{fontSize: 9, color: '#222f3e', fontWeight: 'bold'}}>
                Me
              </Text>
            </View>
          </View>
          <View style={{color: 'black', height: 0.1}} />
        </View>
        <RBSheet
          animationType={'fade'}
          closeOnDragDown
          height={windowHeight * 0.58}
          minClosingHeight={10}
          duration={100}
          onClose={() => this.setState({isMenuSheetOpen: false})}
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          customStyles={{
            wrapper: {
              // backgroundColor: "rgba(0, 0, 0, 0.5)",
              backgroundColor: 'transparent',
            },

            container: {
              width: width,
              // marginHorizontal: 15,
              backgroundColor: 'white',
              borderColor: 'grey',
              borderRadius: 10,
              borderWidth: 0.5,
              bottom: 0,
              alignSelf: 'center',
            },
          }}>
          <View
            style={{
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
            }}
          />
          <FlatList
            data={menuData}
            contentContainerStyle={{alignItems: 'center'}}
            numColumns={3}
            renderItem={({item}) =>
              ((item.isOprOnly === true &&
                this.context.status.isNonOpr == false) ||
                item.isOprOnly === false) && (
                <ImageMenuItem
                  label={item.label}
                  style={{marginHorizontal: 25}}
                  image={item.image}
                  onPress={() => {
                    this.RBSheet.close();

                    item.onPress();
                  }}
                />
              )
            }
            ListHeaderComponent={<View style={{height: 20}} />}
            ListFooterComponent={<View style={{height: 20}} />}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </RBSheet>
        <RBSheet
          animationType={'fade'}
          closeOnDragDown
          height={windowHeight * 0.87}
          duration={200}
          onClose={() => this.setState({isSapSheetOpen: false})}
          ref={(ref) => {
            this.RBSheet2 = ref;
          }}
          customStyles={{
            wrapper: {
              // backgroundColor: 'transparent',
              height: (height * 9) / 11,
            },

            container: {
              width: width,
              backgroundColor: 'white',
              borderColor: 'grey',
              borderRadius: 10,
              borderWidth: 0.5,
              bottom: 0,
              alignSelf: 'center',
            },
          }}>
          {/* <ScrollView style={{backgroundColor: '#dcdde1'}}> */}
          <ScrollView style={{backgroundColor: 'white'}}>
            <View style={{height: 20}} />
            <View>
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  marginBottom: 25,
                  marginTop: 0,
                }}>
                <Text style={styles.personalData}>Personal Data</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{paddingHorizontal: 20, width: width / 2.2}}>
                  {/* <Text style={{fontWeight: '600', marginTop: 20, fontSize: 17}}>
                  Data K3
                </Text> */}
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>NRP</Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.nrp}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>Nama</Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.nama}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>Jabatan</Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.jabatan}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>Nomer HP</Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.no_hp}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>Tanggal lahir</Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.tgl_lahir}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>
                      Status Pernikahan
                    </Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.marital_stat}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>
                      No BPJS Kesehatan
                    </Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.bpjs_tk}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>No BPJS TK</Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.bpjs_ks}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData} />
                    <Text style={styles.titikDua} />
                    <Text style={styles.itemPersonalData} />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>Golongan darah</Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.gol_darah}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>Valid MCU</Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.exp_mcu}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>Valid Permit</Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.valid_permit}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>Valid Simper</Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.valid_simper}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.judulPersonalData}>Valid Simpol</Text>
                    <Text style={styles.titikDua}>: </Text>
                    <Text style={styles.itemPersonalData}>
                      {this.context.userData.valid_simpol}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.judulPersonalData} />
                        <Text style={styles.titikDua} />
                        <Text style={styles.itemPersonalData} />
                      </View>
                      <FlatList
                        data={this.context.userData.keluarga}
                        renderItem={({item}) => {
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text style={styles.judulPersonalData}>
                                {item.ket_hub}
                              </Text>
                              <Text style={styles.titikDua}>: </Text>
                              <Text style={styles.itemPersonalData}>
                                {item.nama_keluarga}
                              </Text>
                            </View>
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={Divider}
                        contentContainerStyle={{padding: 0}}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 30,
                flexDirection: 'row',
              }}>
              <Button
                color={Colors.primary}
                style={{
                  height: 40,
                  width: 160,
                  marginTop: 0,
                  backgroundColor: '#fff9',
                  borderRadius: 20,
                  justifyContent: 'center',
                  marginRight: 10,
                }}
                mode={'contained'}
                onPress={() => {
                  this.RBSheet2.close();
                  this.setState({isMenuSheetOpen: false});
                  setTimeout(() => {
                    this.props.navigation.navigate('ChangePassword');
                  }, 150);
                }}
                icon={({size, color}) => (
                  <Icons name={'lock-check'} size={size} color={color} />
                )}>
                Ubah Passw
              </Button>
              <Button
                color={Colors.primary}
                style={{
                  height: 40,
                  width: 160,
                  backgroundColor: '#FFA41B',
                  marginLeft: 10,
                  borderRadius: 20,
                  justifyContent: 'center',
                }}
                mode={'contained'}
                onPress={this.logoutAsync}
                icon={({size, color}) => (
                  <Icons name={'logout'} size={size} color={color} />
                )}>
                Logout
              </Button>
            </View>
            <View style={{height: 300}} />
          </ScrollView>
        </RBSheet>
        <RBSheet
          animationType={'fade'}
          closeOnDragDown
          height={windowHeight * 0.3}
          // height={this.state.sheetContentsHeight + 55} // height of container
          duration={200}
          onClose={() => this.setState({isMeSheetOpen: false})}
          ref={(ref) => {
            this.RBSheet3 = ref;
          }}
          customStyles={{
            wrapper: {
              // backgroundColor: "rgba(0, 0, 0, 0.5)",
              backgroundColor: 'transparent',
            },

            container: {
              width: width,
              alignSelf: 'center',
              backgroundColor: 'white',
              borderColor: 'grey',
              borderRadius: 10,
              borderWidth: 0.5,
              bottom: 0,
            },
          }}>
          <View>
            <View
              style={{
                alignItems: 'center',
                height: 30,
                justifyContent: 'center',
              }}
            />
            <FlatList
              // scrol
              data={sapData}
              contentContainerStyle={{alignItems: 'center'}}
              numColumns={3}
              renderItem={({item}) =>
                ((item.isOprOnly == true &&
                  this.context.status.isNonOpr == false) ||
                  item.isOprOnly == false) && (
                  <ImageMenuItem
                    label={item.label}
                    style={{marginHorizontal: 25}}
                    image={item.image}
                    onPress={() => {
                      this.RBSheet3.close();

                      item.onPress();
                    }}
                  />
                )
              }
              ListHeaderComponent={<View style={{height: 20}} />}
              ListFooterComponent={<View style={{height: 20}} />}
              ItemSeparatorComponent={() => <View style={{height: 20}} />}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          {/*  =========== Whole window =========== */}
        </RBSheet>
        <RBSheet
          animationType={'fade'}
          closeOnDragDown
          height={windowHeight * 0.58}
          duration={200}
          onClose={() => this.setState({isEssSheetOpen: false})}
          ref={(ref) => {
            this.RBSheet4 = ref;
          }}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },

            container: {
              width: width,
              alignSelf: 'center',
              backgroundColor: 'white',
              borderColor: 'grey',
              borderRadius: 10,
              borderWidth: 0.5,
              bottom: 0,
            },
          }}>
          <View>
            <View
              style={{
                alignItems: 'center',
                height: 30,
                justifyContent: 'center',
              }}
            />
            <FlatList
              // scrol
              data={essData}
              contentContainerStyle={{alignItems: 'center'}}
              numColumns={3}
              renderItem={({item}) =>
                ((item.isOprOnly == true &&
                  this.context.status.isNonOpr == false) ||
                  item.isOprOnly == false) && (
                  <ImageMenuItem
                    label={item.label}
                    style={{marginHorizontal: 25}}
                    image={item.image}
                    onPress={() => {
                      this.RBSheet4.close();

                      item.onPress();
                    }}
                  />
                )
              }
              ListHeaderComponent={<View style={{height: 20}} />}
              ListFooterComponent={<View style={{height: 20}} />}
              ItemSeparatorComponent={() => <View style={{height: 20}} />}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          {/*  =========== Whole window =========== */}
        </RBSheet>
        <HmStartDialog
          isVisible={this.state.hmStartDialogVisible}
          onHide={this.hideHmStartDialog}
        />
        <Dialog.Container
          visible={this.state.hmStopDialogVisible}
          style={{bottom: 100}}>
          <Dialog.Title
            style={{
              fontSize: 30,
              color: 'orange',
              alignSelf: 'center',
              margihBottom: 30,
              height: 60,
            }}>
            STOP OPERASI
          </Dialog.Title>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: 'grey',
              margihBottom: 10,
              backgroundColor: 'transparent',
              height: 50,
            }}>
            <Dialog.Input
              // label="Masukkan HM Stop:"
              placeholder="HM/KM Stop"
              onChangeText={(text) => this.setState({hmStop: text})}
              keyboardType={'numeric'}
              height={50}
              paddingLeft={30}
              style={{fontSize: 25}}
            />
          </View>
          <View style={{height: 10}} />
          <View
            style={{
              borderWidth: 0.5,
              borderColor: 'grey',
              margihBottom: 10,
              backgroundColor: 'transparent',
              height: 50,
            }}>
            <Dialog.Input
              // label="Lokasi Parkir"
              placeholder="Lokasi Parkir"
              onChangeText={(text) => this.setState({parkingLocation: text})}
              // keyboardType={'numeric'}
              height={50}
              width={width / 2 + 20}
              borderWidth={0}
              borderColor={'orange'}
              borderRadius={0}
              paddingLeft={30}
              style={{fontSize: 20}}
            />
          </View>
          <View style={{height: 30}} />
          <Dialog.Button label="Confirm" bold onPress={this.confirmHmStop} />
          <Dialog.Button label="Cancel" onPress={this.hideHmStopDialog} />
        </Dialog.Container>
        <Dialog.Container visible={this.state.parkingLocationDialogVisible}>
          <Dialog.Title>Parking Location</Dialog.Title>
          <Dialog.Input
            // label="Location:"
            // placeholder="Masukan Lokasi"
            onChangeText={(text) => this.setState({parkingLocation: text})}
            height={50}
            width={width}
            multiline={true}
            style={{fontSize: 20}}
          />
          <Dialog.Button
            label="Confirm"
            bold
            onPress={this.confirmParkingLocation}
          />
          <Dialog.Button
            label="Cancel"
            onPress={this.hideParkingLocationDialog}
          />
        </Dialog.Container>
        <Modal
          isVisible={this.context.isLoading}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}>
            <ActivityIndicator
              size="large"
              animating={true}
              color={Colors.red800}
            />
            <Text style={{marginTop: 15}}>Loading...</Text>
          </View>
        </Modal>
        <Modal isVisible={this.context.lastParkingLocationDialogVisible}>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
            }}>
            <View style={{padding: 15}}>
              <Title>{this.context.status.unit}</Title>
              <Text>Last Parking Location</Text>
            </View>
            <View
              style={{
                padding: 20,
                backgroundColor: Colors.grey300,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icons name="map-marker" size={20} style={{marginRight: 7}} />
              <Text style={{flex: 1}}>
                {this.context.status.lastParkingLocation}
              </Text>
            </View>
            <Divider />
            <View style={{padding: 10}}>
              <Button
                mode="contained"
                onPress={() =>
                  this.context.setLastParkingLocationDialogVisible(false)
                }>
                Ok
              </Button>
            </View>
          </View>
        </Modal>
        <Snackbar
          visible={this.state.snackbarVisible}
          onDismiss={this.hideSnackbar}
          duration={3000}>
          {this.state.snackbarMsg}
        </Snackbar>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  savearea: {
    height: windowHeight,
    width: windowWidth,
    flexDirection: 'column',
  },
  profile: {
    width: 60,
    height: 0,
    backgroundColor: 'green',
    borderRadius: 35,
    marginTop: 20,
    marginLeft: 40,
  },

  personalData: {fontSize: 30, fontWeight: 'bold'},
  itemPersonalData: {
    fontSize: 13,
    fontFamily: 'Zocial',
    // fontFamily: 'Cookie-Regular',
    marginTop: 0,
    width: (width * 5) / 10,
    // color: '#0abde3',
  },
  judulPersonalData: {
    fontSize: 14,
    fontFamily: 'Fontisto',
    marginTop: 0,
    width: (width * 3.5) / 10,
    color: '#576574',
  },
  titikDua: {fontSize: 15, marginTop: 0, width: width / 17, color: '#576574'},

  mapcontainer: {
    padding: 20,
    backgroundColor: Colors.grey300,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalcontainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indikatoract: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fragmen: {
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
  },
  rubahpass: {
    height: 40,
    width: 220,
    marginBottom: 20,
    marginTop: 35,
    borderRadius: 25,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  logot: {
    height: 55,
    width: 200,
    marginTop: 25,
    backgroundColor: '#FFA41B',
    marginBottom: 20,
    borderRadius: 25,
    justifyContent: 'center',
  },
});

HomeScreen.contextType = AppContext;
export default HomeScreen;
