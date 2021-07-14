import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  ScrollView,
  Alert,
  TouchableNativeFeedback,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  Colors,
  FAB,
  Headline,
  Divider,
  Button,
  List,
  Title,
  Snackbar,
  ActivityIndicator,
  // TextInput,
  Card,
  Appbar,
} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import {AppContext} from '../context';
import axios from 'axios';
import Modal from 'react-native-modal';
import Geolocation from '@react-native-community/geolocation';
import {RosterList} from '../components';
const {width, height} = Dimensions.get('screen');
const h_margin = 15;
const text_height = width / 7;
const text_width = width - h_margin;

class SayaPeduliPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unit: '',
      confirmCheckOutDialogVisible: false,
      hmStartDialogVisible: false,
      hmStopDialogVisible: false,
      parkingLocationDialogVisible: false,
      rosterDialogVisible: false,
      reportWarnDialogVisible: false,

      snackbarVisible: false,
      snackbarMsg: null,

      hmStart: null,
      hmStop: null,
      parkingLocation: null,

      isProfileImageError: false,

      rosterObj: null,
      lokasiText: '',
      kegiatanText: '',
      rekanText: '',
      suhuBadanText: 0,

      isGangguanKesehatanLoading: true,
      isGangguanKesehatanVisible: false,
      gangguanKesehatan: [
        {
          id: '',
          question: '',
          isCorrect: null,
        },
      ],

      location: {
        lat: '',
        long: '',
      },

      timer: null,
    };
  }

  getGangguanKesehatan = (rosterId) => {
    this.setState({isGangguanKesehatanLoading: true});
    axios
      .get(`/questionByRoster/${rosterId}`)
      .then((res) => {
        const newObj = res.data.map((item) => ({...item, isCorrect: null}));

        this.setState({
          isGangguanKesehatanLoading: false,
          gangguanKesehatan: newObj,
        });
      })
      .catch((error) => {
        this.setState({
          isGangguanKesehatanLoading: false,
        });
      });
  };

  setGangguanKesehatan = (id, value) => {
    const updated = this.state.gangguanKesehatan.map((item, index) => {
      if (index === id) {
        return {...item, isCorrect: value};
      }
      return item;
    });
    this.setState({gangguanKesehatan: updated});
  };

  // checkLastReport = async () => {
  //   const lastActivityReport = JSON.parse(
  //     await AsyncStorage.getItem('lastActivityReport'),
  //   );

  //   if (await lastActivityReport) {
  //     const time = await lastActivityReport.time;
  //     const interval = await lastActivityReport.interval;

  //     const dateNow = new Date();
  //     let dateLast = new Date(time);
  //     dateLast.setMinutes(dateLast.getMinutes() + +interval);
  //     if (dateNow >= dateLast) {
  //       if (!this.state.reportWarnDialogVisible) {
  //         this.showReportWarnDialogVisible();
  //       }
  //     }
  //   } else {
  //     this.showReportWarnDialogVisible();
  //   }
  // };

  logoutAsync = async () => {
    await AsyncStorage.clear();
    this.context.clearUserData();
    this.props.navigation.navigate('AuthLoading');
  };

  showSnackbar = (msg) => {
    this.setState({snackbarVisible: true, snackbarMsg: msg});
  };

  hideSnackbar = () => {
    this.setState({snackbarVisible: false, snackbarMsg: null});
  };

  setRoster = (val) => {
    this.setState(
      {rosterObj: val, isGangguanKesehatanVisible: false},
      () => val && this.getGangguanKesehatan(this.state.rosterObj.id),
    );
    console.log(val);
  };

  hideRosterDialog = () => {
    this.setState({rosterDialogVisible: false});
  };

  showRosterDialog = () => {
    this.setState({rosterDialogVisible: true});
  };

  showReportWarnDialogVisible = () => {
    this.setState({reportWarnDialogVisible: true});
  };

  hideReportWarnDialogVisible = () => {
    this.setState({reportWarnDialogVisible: false});
  };

  goBack = () => {
    this.props.navigation.navigate('Home');
  };

  onSendActivityReport = () => {
    const isGangguanKesehatanInvalid = this.state.gangguanKesehatan.some(
      (item) => item.isCorrect == null,
    );

    if (
      isGangguanKesehatanInvalid ||
      !this.state.rosterObj ||
      !this.state.lokasiText ||
      !this.state.kegiatanText ||
      !this.state.rekanText ||
      !this.state.suhuBadanText
    ) {
      this.showSnackbar('Lengkapi isian!');
    } else {
      this.context.setLoading(true);

      Geolocation.getCurrentPosition(
        // Will give you the current location
        (position) => {
          const currentLongitude = JSON.stringify(position.coords.longitude);
          const currentLatitude = JSON.stringify(position.coords.latitude);

          const responsePayload = this.state.gangguanKesehatan.reduce(
            (obj, item) => {
              return {
                ...obj,
                [item.id]: item.isCorrect,
              };
            },
            {},
          );
          axios({
            method: 'post',
            url: '/activity',
            data: {
              roster: this.state.rosterObj.id,
              lokasi: `${currentLatitude}/${currentLongitude}/${this.state.lokasiText}`,
              // lokasi: '100}/100/100',
              kegiatan: this.state.kegiatanText,
              rekan: this.state.rekanText,
              suhu_badan: this.state.suhuBadanText,
              kesehatan: '',
              keterangan: '',
              nrp: this.context.userData.nrp,
              response: JSON.stringify(responsePayload),
            },
          })
            .then((response) => {
              this.refs.scrollViewRef.scrollTo({y: 0});

              this.context.setLoading(false);
              Alert.alert(response.data.message, response.data.message);

              const dateNow = new Date();
              const dateNowStr = dateNow.toString();

              const lastActivityReport = {
                time: dateNowStr,
                interval: this.state.rosterObj.report_interval,
              };

              AsyncStorage.setItem(
                'lastActivityReport',
                JSON.stringify(lastActivityReport),
              );

              const newGangguanKesehatanObj = this.state.gangguanKesehatan.map(
                (item) => ({
                  ...item,
                  isCorrect: null,
                }),
              );

              this.setState({
                rosterObj: null,
                lokasiText: '',
                kegiatanText: '',
                rekanText: '',
                suhuBadanText: 0,
                gangguanKesehatan: newGangguanKesehatanObj,
                isGangguanKesehatanVisible: false,
              });
              this.context.setLoading(false);
              this.goBack();
            })
            .catch((error) => {
              this.context.setLoading(false);
              // alert(error);
            });
        },
        (error) => {
          Alert.alert(
            'Location Error',
            `${error.message}, and please turn on GPS`,
            [{text: 'Ok', onPress: () => null}],
            {cancelable: false},
          );
          this.context.setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
        },
      );
    }
  };

  render() {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={'#0F4C75'}
          translucent={false}
        />

        <SafeAreaView style={{flex: 1}}>
          <Appbar.Header style={{zIndex: 3}}>
            <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Saya Peduli" />
          </Appbar.Header>

          <View style={{flex: 1, zIndex: 0, backgroundColor: Colors.grey50}}>
            <View style={{flex: 1}}>
              <View style={{flex: 1, backgroundColor: Colors.clear}}>
                <ScrollView
                  ref="scrollViewRef"
                  style={{paddingHorizontal: 10}}
                  showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      width: -20 + width - 2 * h_margin,
                      alignSelf: 'center',
                    }}>
                    <Text style={{marginVertical: 10, color: 'grey'}}>
                      Saya yang bertanda tangan di bawah ini :
                    </Text>
                    <Text style={{fontWeight: '700', color: '#3c6382'}}>
                      {this.context.userData.nama}
                    </Text>
                    <Text style={{fontSize: 12, color: '#F79F1F'}}>
                      {this.context.userData.posisi}
                    </Text>
                    <Text style={{marginVertical: 10, color: 'grey'}}>
                      Menyatakan bahwa pada saat membuat laporan ini :
                    </Text>
                  </View>
                  <TouchableNativeFeedback
                    delayPressIn={0}
                    background={TouchableNativeFeedback.Ripple(Colors.grey300)}
                    onPress={this.showRosterDialog}>
                    <View style={styles.inputtext}>
                      <Text
                        style={{
                          color: 'grey',
                          fontSize: 16.5,
                          justifyContent: 'center',
                          marginLeft: 15,
                        }}>{`Roster kerja ${
                        this.state.rosterObj ? ': ' : ''
                      }`}</Text>
                      {this.state.rosterObj && (
                        <Text
                          style={{
                            fontSize: 16.5,
                            color: '#7f8c8d',
                          }}>
                          {this.state.rosterObj.roster}
                        </Text>
                      )}
                    </View>
                  </TouchableNativeFeedback>
                  <View style={styles.inputtext}>
                    <TextInput
                      selectionColor="red"
                      mode="contained"
                      placeholder="Penjelasan kegiatan yang sedang dilakukan"
                      placeholderTextColor="#7f8c8d"
                      label="Penjelasan Kegiatan"
                      multiline
                      value={this.state.kegiatanText}
                      onChangeText={(text) =>
                        this.setState({kegiatanText: text})
                      }
                      style={{
                        marginHorizontal: 10,
                        color: '#636e72',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                  <View style={styles.inputtext}>
                    <TextInput
                      selectionColor="red"
                      mode="contained"
                      placeholder="Nama kantor/tambang/lokasi lain dan nama kota dimana aktivitas dilakukan"
                      placeholderTextColor="#7f8c8d"
                      label="Lokasi"
                      multiline
                      value={this.state.lokasiText}
                      onChangeText={(text) => this.setState({lokasiText: text})}
                      style={{marginHorizontal: 10, color: '#636e72'}}
                    />
                  </View>
                  <View style={styles.inputtext}>
                    <TextInput
                      selectionColor="red"
                      mode="contained"
                      placeholder="Sebutkan nama -nama kontak yang berkontak erat (pisahkan setiap nama dengan koma)"
                      placeholderTextColor="#7f8c8d"
                      label="Rekan yang berkontak erat"
                      multiline
                      value={this.state.rekanText}
                      onChangeText={(text) => this.setState({rekanText: text})}
                      style={{marginHorizontal: 10, color: '#636e72'}}
                    />
                  </View>
                  <View style={styles.inputtext}>
                    <TextInput
                      selectionColor="red"
                      mode="contained"
                      placeholder="Suhu badan diukur menggunakan thermometer "
                      placeholderTextColor="#7f8c8d"
                      label="Suhu badan saya saat ini (°C)"
                      // multiline
                      keyboardType="numeric"
                      value={this.state.suhuBadanText}
                      onChangeText={(text) =>
                        this.setState({suhuBadanText: text})
                      }
                      onBlur={() => {
                        if (
                          +this.state.suhuBadanText < 32 ||
                          +this.state.suhuBadanText > 42
                        ) {
                          this.setState({suhuBadanText: 0});
                          this.showSnackbar('Suhu badan tidak valid');
                        }
                      }}
                      style={{marginHorizontal: 10, color: '#636e72'}}
                    />
                  </View>
                  <View
                    style={{
                      width: width - h_margin - h_margin + 1,
                      flexDirection: 'row',
                      marginTop: 15,
                      borderWidth: 0.5,
                      borderColor: '#F79F1F',
                      borderRadius: width / 14,
                    }}>
                    <View
                      style={{
                        width: 30 + (width - h_margin - h_margin) / 2,
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        borderTopLeftRadius: width / 14,
                        borderBottomLeftRadius: width / 14,
                      }}>
                      <Text style={{fontSize: 16.5}}>
                        Riwayat 2 hari terakhir :
                      </Text>
                    </View>
                    <View
                      style={{
                        width: -30 + (width - h_margin - h_margin) / 2,
                      }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor:
                            this.state.isGangguanKesehatanVisible === true
                              ? Colors.lightGreen300
                              : Colors.grey300,
                          // padding: 10,
                          paddingVertical: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderTopRightRadius: width / 14,
                          borderBottomRightRadius: width / 14,
                        }}
                        delayPressIn={0}
                        // background={TouchableNativeFeedback.Ripple(Colors.white)}
                        onPress={() => {
                          if (!this.state.rosterObj) {
                            this.showSnackbar(
                              'Silakan pilih kegiatan terlebih dahulu!',
                            );
                          } else {
                            this.setState(
                              {
                                isGangguanKesehatanVisible: !this.state
                                  .isGangguanKesehatanVisible,
                              },
                              () => {
                                if (this.state.isGangguanKesehatanVisible) {
                                  setTimeout(() => {
                                    this.refs.scrollViewRef.scrollTo({y: 400});
                                  }, 300);
                                }
                              },
                            );
                          }
                        }}>
                        <Text style={{fontSize: 14.0, fontWeight: 'bold'}}>
                          {this.state.isGangguanKesehatanVisible
                            ? 'Sembunyikan'
                            : 'Tampilkan'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {this.state.isGangguanKesehatanVisible && (
                    <View
                      style={{
                        marginTop: 20,
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
                        borderColor: Colors.grey200,
                        borderWidth: 1,
                        padding: 5,
                        backgroundColor: Colors.white,
                        width: width - h_margin,
                        alignSelf: 'center',
                      }}>
                      {this.state.isGangguanKesehatanLoading ? (
                        // <LoadingIndicator />
                        <Text>Loading</Text>
                      ) : (
                        <View
                          style={{
                            backgroundColor: 'transparent',
                            width: width - h_margin,
                            alignSelf: 'center',
                          }}>
                          <FlatList
                            keyboardShouldPersistTaps={'always'}
                            scrollEnabled={false}
                            data={this.state.gangguanKesehatan}
                            renderItem={({item, index}) => (
                              <Card
                                style={{
                                  marginBottom: 10,
                                  paddingHorizontal: 10,
                                  elevation: 0,
                                  backgroundColor: Colors.grey500,
                                  // backgroundColor: Colors.blueGrey400,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      // flex: 1,
                                      marginVertical: 10,
                                      width: 60 + width / 2 - h_margin,
                                      paddingHorizontal: 10,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 16.5,
                                        color: Colors.white,
                                      }}>
                                      {item.question}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: -60 + width / 2 - h_margin,
                                      flexDirection: 'row',
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        item.isCorrect
                                          ? null
                                          : this.setGangguanKesehatan(
                                              index,
                                              true,
                                            )
                                      }
                                      style={{
                                        width: 55,
                                        borderWidth: 1,
                                        borderColor: item.isCorrect
                                          ? Colors.teal600
                                          : Colors.grey300,
                                        borderTopLeftRadius: 20,
                                        borderBottomLeftRadius: 20,
                                        padding: 7,
                                        alignItems: 'center',
                                        backgroundColor: item.isCorrect
                                          ? Colors.teal400
                                          : Colors.grey100,
                                      }}>
                                      <Text
                                        style={
                                          item.isCorrect && {
                                            color: Colors.white,
                                            fontWeight: 'bold',
                                          }
                                        }>
                                        Ya
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() =>
                                        item.isCorrect == false
                                          ? null
                                          : this.setGangguanKesehatan(
                                              index,
                                              false,
                                            )
                                      }
                                      style={{
                                        width: 55,
                                        borderWidth: 1,
                                        borderColor:
                                          item.isCorrect == false
                                            ? Colors.green400
                                            : Colors.grey300,
                                        borderTopRightRadius: 20,
                                        borderBottomRightRadius: 20,
                                        padding: 7,
                                        alignItems: 'center',
                                        backgroundColor:
                                          item.isCorrect == false
                                            ? Colors.green400
                                            : Colors.grey100,
                                      }}>
                                      <Text
                                        style={
                                          item.isCorrect == false && {
                                            color: Colors.white,
                                            fontWeight: 'bold',
                                          }
                                        }>
                                        Tidak
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </Card>
                            )}
                            ItemSeparatorComponent={Divider}
                            keyExtractor={(item, index) => index.toString()}
                          />
                        </View>
                      )}
                      <View
                        style={{
                          marginVertical: 20,
                          paddingTop: 10,
                          marginHorizontal: 15,
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'grey',
                          }}>
                          Demikian surat pernyataan ini saya buat dengan
                          sebenar-benarnya sebagai salah satu syarat untuk dapat
                          berkunjung atau bekerja di PT PPA . Saya bersedia
                          menerima sanksi sesuai Peraturan Perusahaan dan sesuai
                          hukum yang berlaku apabila dikemudian hari terbukti
                          memalsukan pernyataan diatas .
                        </Text>
                      </View>
                    </View>
                  )}

                  <View
                    style={{
                      width: width - 4 * h_margin,
                      marginTop: 40,
                      marginBottom: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      zIndex: 1,
                      height: 50,
                      backgroundColor: '#F79F1F',
                      elevation: 3,
                      borderRadius: 25,
                    }}>
                    <FAB
                      color={Colors.white}
                      label={'Setuju & Kirim'}
                      style={{
                        height: 50,
                        // elevation: 3,
                        backgroundColor: '#F79F1F',
                        width: width - 4 * h_margin,
                      }}
                      icon={({size, color}) => (
                        <Icons name={'send'} size={size} color={color} />
                      )}
                      onPress={() => {
                        this.onSendActivityReport();
                        // alert(this.state.suhuBadanText);
                      }}
                    />
                  </View>
                  <View Style={{height: 500}} />
                </ScrollView>
              </View>
            </View>
          </View>
        </SafeAreaView>
        <RBSheet
          animationType={'fade'}
          closeOnDragDown
          height={350}
          duration={500}
          ref={(ref) => {
            this.RBSheet = ref;
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 40,
              marginTop: 67,
              fontSize: 10,
            }}>
            <FeatherIcons name="minus" size={60} color={Colors.grey300} />
          </View>
          <View style={{flex: 1}} />
          <List.Item
            title="User"
            description={this.context.userData.nama}
            left={(props) => <List.Icon {...props} icon="person" />}
          />
          <Divider />
          <List.Item
            title="Checked In Unit"
            description={
              this.context.status.isCheckedIn
                ? this.context.status.unit
                : 'Unit checked out'
            }
            left={(props) => <List.Icon {...props} icon="local-shipping" />}
          />
          <Divider />
          <List.Item
            title="MAC Address"
            description={this.context.mac}
            left={(props) => <List.Icon {...props} icon="phonelink-lock" />}
          />
          <Button
            color={Colors.grey800}
            style={{margin: 20}}
            mode={'contained'}
            onPress={this.logoutAsync}>
            Logout
          </Button>
        </RBSheet>

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

        <Modal
          isVisible={this.state.rosterDialogVisible}
          onBackButtonPress={this.hideRosterDialog}
          onBackdropPress={this.hideRosterDialog}
          animationIn="fadeInUp"
          animationOut="fadeOutDown">
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                elevation: 5,
                padding: 15,
              }}>
              <Title>Pilih Kegiatan</Title>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.grey100,
              }}>
              <View style={{flex: 1}}>
                <RosterList
                  val={this.state.rosterObj}
                  onSet={this.setRoster}
                  onLogout={this.logoutAsync}
                />
              </View>
            </View>
            <Divider />
            <View
              style={{
                backgroundColor: Colors.white,
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                flexDirection: 'row',
                padding: 10,
                justifyContent: 'flex-end',
              }}>
              <Button
                disabled={!this.state.rosterObj}
                onPress={this.hideRosterDialog}
                mode={!this.state.rosterObj ? 'text' : 'contained'}
                color={Colors.green600}>
                Confirm
              </Button>
              <Button
                color={Colors.green800}
                onPress={() => {
                  this.hideRosterDialog();
                  this.setState({rosterObj: null});
                }}
                mode="text">
                Cancel
              </Button>
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.reportWarnDialogVisible}
          onBackButtonPress={this.hideReportWarnDialogVisible}
          animationIn="slideInDown"
          animationOut="slideOutUp"
          useNativeDriver={true}
          style={{backgroundColor: '#0F4C75', margin: 0}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icons
              name="account-alert"
              color={Colors.white}
              size={100}
              style={{marginLeft: 20}}
            />
            <Headline
              style={{
                color: Colors.white,
                fontWeight: 'bold',
                marginTop: 20,
              }}>
              Activity Report
            </Headline>
            <Headline
              style={{
                color: Colors.white,
                fontWeight: 'bold',
                lineHeight: 25,
              }}>
              Belum Diisi
            </Headline>
            <Button
              color="#f1c40f"
              style={{marginTop: 15}}
              mode="contained"
              onPress={this.hideReportWarnDialogVisible}>
              Mengerti
            </Button>
          </View>
        </Modal>

        <Snackbar
          visible={this.state.snackbarVisible}
          onDismiss={this.hideSnackbar}
          duration={3000}
          onPress={() => null}>
          {this.state.snackbarMsg}
        </Snackbar>
      </>
    );
  }
}

const styles = {
  inputtext: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderColor: '#F79F1F',
    borderWidth: 0.5,
    borderRadius: width / 16 + 5,
    width: width - h_margin - h_margin,
    height: width / 8 + 5,
    marginVertical: 5,
  },
};
SayaPeduliPage.contextType = AppContext;
export default SayaPeduliPage;
