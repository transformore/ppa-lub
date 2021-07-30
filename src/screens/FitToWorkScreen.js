import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  Alert,
  Keyboard,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Colors, Appbar, ActivityIndicator, FAB} from 'react-native-paper';

import {ScrollView} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import Axios from 'axios';
import {AppContext} from '../context';
import Modal from 'react-native-modal';
import {LoadingIndicator, ErrorData, FillForm} from '../components';
import {colors} from '../styles';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import FeatherIcons from 'react-native-vector-icons/Feather';

const {width, height} = Dimensions.get('screen');
const h_margin = 20;
const spacer = 5;

export class FitToWorkScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      refreshing: false,
      requestError: false,
      nrp: '',
      lokasiOptions: null,
      jamOptions: null,
      lokasiId: null,
      jamId: null,
      obatId: null,
      sehatId: null,
      keyboardState: 'closed',
      image: null,
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    this.getFtwData();
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  resetState = () => {
    this.setState({
      lokasiId: null,
      jamId: null,
      obatId: null,
      sehatId: null,
      keyboardState: 'closed',
      image: null,
    });
  };

  _keyboardDidShow = () => {
    this.setState({
      keyboardState: 'opened',
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      keyboardState: 'closed',
    });
  };

  getFtwData = () => {
    this.setState({loading: true});
    Axios.get(`/ftwForm/${this.context.userData.nrp}`)
      .then((res) => {
        // alert(JSON.stringify(res.data));
        const formattedJam = res.data.opsi_jam.map((item, index) => ({
          id: index,
          code: item.value,
          name: item.text,
        }));
        const formattedSehat = res.data.kesehatan.map((item, index) => ({
          id: index,
          code: item.value,
          name: item.text,
        }));
        const formattedObat = res.data.obat.map((item, index) => ({
          id: index,
          code: item.value,
          name: item.text,
        }));
        const formattedLokasi = res.data.lokasi.map((item, index) => ({
          id: index,
          code: item.id,
          name: item.lokasi,
        }));

        this.setState({
          loading: false,
          refreshing: false,
          requestError: false,

          jamOptions: formattedJam,
          sehatOptions: formattedSehat,
          obatOptions: formattedObat,
          lokasiOptions: formattedLokasi,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          refreshing: false,
          requestError: true,
        });
        alert('Terjadi kesalahan ftw: ' + error);
      });
  };

  handleKirim = () => {
    if (
      this.state.image === null ||
      this.state.lokasiId === null ||
      this.state.jamId === null ||
      this.state.sehatId === null ||
      this.state.obatId === 0
    ) {
      Alert.alert(
        'Oops!',
        'Lengkapi isian.',
        [
          {
            text: 'OK',
            onPress: () => null,
          },
        ],
        {onDismiss: () => null},
      );
    } else {
      this.context.setLoading(true);
      const {
        lokasiId,
        lokasiOptions,
        jamId,
        jamOptions,
        obatId,
        obatOptions,
        sehatId,
        sehatOptions,
      } = this.state;
      var data = new FormData();
      data.append('nrp', this.context.userData.nrp);
      data.append('lokasi_id', lokasiOptions[lokasiId].code);
      data.append('kondisi', sehatOptions[sehatId].code);
      data.append('jam_istirahat', jamOptions[jamId].code);
      data.append('obat', obatOptions[obatId].code);
      data.append('face', {
        uri: this.state.image.path,
        type: this.state.image.mime,
        name: 'image.jpg',
      });

      // Axios.post('/ftw', {
      //   nrp: this.context.userData.nrp,
      //   lokasi_id: this.state.lokasiOptions[this.state.lokasiId].code,
      //   jam_istirahat: this.state.jamOptions[this.state.jamId].code,
      //   obat: this.state.obatOptions[this.state.obatId].code,
      //   kondisi: this.state.sehatOptions[this.state.sehatId].code,
      // })
      Axios.post('/ftw', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

        .then((response) => {
          this.context.setLoading(false);
          Alert.alert(
            'Success',
            `${response.data.message}`,
            [
              {
                text: 'OK',
                // onPress: () => this.props.navigation.goBack(),
                onPress: () => this._openUnitSelect(),
              },
            ],
            {onDismiss: () => this.props.navigation.goBack()},
          );
          this.resetState();
        })
        .catch((error) => {
          this.context.setLoading(false);
          Alert.alert(
            'Oops!',
            JSON.stringify(error),
            [
              {
                text: 'OK',
                onPress: () => null,
              },
            ],
            {onDismiss: () => null},
          );
        });
    }
  };

  _openUnitSelect = () => {
    this.props.navigation.navigate('SelectUnit');
  };

  takeImage = () => {
    // this.RBSheet.close();
    ImagePicker.openCamera({
      // width: (width / 2.5) * 6,
      // height: (height / 6) * 10,
      freeStyleCropEnabled: false,
      compressImageQuality: 0.6,
      cropping: false,
    })
      .then((image) => {
        this.RBSheet.close();
        this.setState({image: image});
        // this.context.setPhoto(image);
      })
      .catch(() => {});
  };
  render() {
    return (
      <>
        {/* <StatusBar
          barStyle="light-content"
          hidden={false}
          translucent={false}
          backgroundColor={'#0F4C75'}
        /> */}

        <Appbar.Header style={{zIndex: 3}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Fit To Work Statement" />
        </Appbar.Header>

        <View style={{flex: 1}}>
          {this.state.loading ? (
            <LoadingIndicator />
          ) : this.state.requestError ? (
            <ErrorData onRetry={this.getHazardData} />
          ) : (
            <>
              <ScrollView style={{flex: 1, backgroundColor: colors.safeArea}}>
                <View
                  style={{
                    marginHorizontal: 0,
                  }}>
                  <View style={{marginTop: 30}}>
                    <Text
                      style={{
                        fontSize: 17,
                        color: '#F79F1F',
                        marginHorizontal: h_margin,
                      }}>
                      Saya yang bertanda dibawah ini ,
                    </Text>
                    <View style={{height: 15}} />
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: h_margin,
                        width: width / 2,
                      }}>
                      <View
                        style={{
                          height: height / 4.5,
                          backgroundColor: 'transparent',
                          width: width / 2.5,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderColor: 'grey',
                          borderWidth: 0.5,
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.75}
                          onPress={() => this.takeImage()}>
                          {/* onPress={() => this.RBSheet.open()}> */}
                          <View
                            style={{
                              width: width / 2.5,
                              height: height / 4.5,
                              // marginHorizontal: 20,
                              borderStyle:
                                this.state.image == null ? 'dashed' : 'solid',
                              borderRadius: 10,
                              borderWidth: this.state.image == null ? 1.7 : 1,
                              borderColor:
                                this.state.image == null
                                  ? Colors.grey500
                                  : Colors.grey500,
                              backgroundColor:
                                this.state.image == null
                                  ? Colors.grey200
                                  : 'transparent',
                              justifyContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                            }}>
                            {this.state.image == null ? (
                              <>
                                <FeatherIcons
                                  name={'camera'}
                                  size={60}
                                  color={Colors.grey500}
                                />
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    // flexDirection: 'column',
                                    width: 100,
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 17,
                                      color: Colors.grey500,
                                      marginTop: 5,
                                    }}>
                                    Foto Wajah
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 17,
                                      color: Colors.grey500,
                                      marginTop: 5,
                                      alignSelf: 'center',
                                    }}>
                                    & Latar
                                  </Text>
                                </View>
                              </>
                            ) : (
                              <Image
                                style={{
                                  flex: 1,
                                  width: width / 2.5,
                                  height: height / 6,
                                  resizeMode: 'cover',
                                  borderRadius: 10,
                                }}
                                source={{
                                  uri: this.state.image.path,
                                  // width: 100,
                                  // height: 100,
                                }}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          marginHorizontal: h_margin,
                          width: width / 2.5,
                        }}>
                        <Text
                          style={{
                            // fontFamily: 'DancingScript-Bold',
                            fontSize: 14,
                            color: '#3c6382',
                            fontWeight: '900',
                          }}>
                          {this.context.userData.nama}
                        </Text>
                        <Text
                          style={{
                            // fontFamily: 'DancingScript-Bold',
                            fontSize: 11,
                            color: '#747d8c',
                            fontWeight: '600',
                          }}>
                          {this.context.userData.jabatan}
                        </Text>
                        <Text
                          style={{
                            // fontFamily: 'DancingScript-Bold',
                            fontSize: 11,
                            color: '#747d8c',
                            fontWeight: '600',
                          }}>
                          {this.context.userData.nrp}
                        </Text>
                        {this.state.obatId === null ||
                        this.state.lokasiId === null ||
                        this.state.jamId === null ||
                        this.state.sehatId === null ? (
                          <Text />
                        ) : this.state.jamId == 0 ? (
                          <View
                            style={{
                              flexDirection: 'column',
                              // alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                marginTop: 20,
                                fontFamily: 'Gruppo-Regular',
                                // fontWeight: 'bold',
                                width: 160,
                                color: 'red',
                              }}>
                              Lapor kepada atasan !! kondisi anda :
                            </Text>
                            <View style={styles.unfit}>
                              <Text style={{fontSize: 18, color: 'white'}}>
                                UNFIT
                              </Text>
                            </View>
                          </View>
                        ) : this.state.jamId == 1 ? (
                          <View>
                            <View
                              style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  marginTop: 20,
                                  fontFamily: 'Gruppo-Regular',
                                  // fontWeight: 'bold',
                                  width: 160,
                                }}>
                                Lapor kepada atasan , kondisi anda perlu
                              </Text>
                            </View>
                            <View style={styles.observe}>
                              <Text style={{fontSize: 18}}>OBSERVASI</Text>
                            </View>
                          </View>
                        ) : this.state.obatId == 0 ? (
                          <View style={styles.observe}>
                            <Text style={{fontSize: 18}}>OBSERVASI</Text>
                          </View>
                        ) : this.state.sehatId == 1 ? (
                          <View style={styles.observe}>
                            <Text style={{fontSize: 18}}>OBSERVASI</Text>
                          </View>
                        ) : (
                          <View>
                            <View>
                              <Text
                                style={{
                                  marginTop: 20,
                                  fontFamily: 'Gruppo-Regular',
                                  // fontWeight: 'bold',
                                  width: 160,
                                }}>
                                Selamat !! kondisi anda
                              </Text>
                            </View>
                            <View style={styles.fit}>
                              <Text style={{fontSize: 18, color: 'white'}}>
                                FIT
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={{height: 30}} />
                  </View>
                  {/* <View style={styles.textinput}> */}
                  <FillForm
                    label="Lokasi "
                    mode="contained"
                    value={
                      this.state.lokasiId != null &&
                      this.state.lokasiOptions[this.state.lokasiId].name
                    }
                    optionData={this.state.lokasiOptions}
                    useIndexReturn={true}
                    onOptionChoose={(val) => this.setState({lokasiId: val})}
                    hasHelper={false}
                    style={{
                      backgroundColor:
                        this.state.lokasiId != null
                          ? 'transparent'
                          : colors.yello,
                      borderWidth: 0.4,
                      borderColor: colors.yello,
                      marginHorizontal: 20,
                      height: this.state.lokasiId != null ? 45 : 40,
                      width: width - 3 * h_margin,
                      alignSelf: 'center',
                    }}
                  />
                  {/* </View> */}

                  <View style={{marginTop: 20}}>
                    <Text
                      style={{
                        fontSize: 17,
                        color: '#F79F1F',
                        marginHorizontal: h_margin,
                      }}>
                      Menyatakan bahwa dalam 24 jam terakhir ,
                    </Text>
                  </View>
                  <View style={{height: spacer}} />
                  <FillForm
                    label="Waktu Istirahat"
                    mode="contained"
                    value={
                      this.state.jamId != null &&
                      this.state.jamOptions[this.state.jamId].name
                    }
                    optionData={this.state.jamOptions}
                    useIndexReturn={true}
                    onOptionChoose={(val) => this.setState({jamId: val})}
                    hasHelper={false}
                    style={{
                      backgroundColor:
                        this.state.jamId != null ? 'transparent' : colors.yello,
                      color: this.state.jamId != null ? 'grey' : 'black',
                      borderWidth: 0.4,
                      // borderColor: colors.deepgrey,
                      marginHorizontal: 20,
                      height: this.state.jamId != null ? 45 : 40,
                      width: width - 3 * h_margin,
                      alignSelf: 'center',
                      marginTop: 10,
                    }}
                  />
                  <View style={{height: spacer}} />
                  <FillForm
                    label="Kondisi kesehatan"
                    mode="contained"
                    value={
                      this.state.sehatId != null &&
                      this.state.sehatOptions[this.state.sehatId].name
                    }
                    optionData={this.state.sehatOptions}
                    useIndexReturn={true}
                    onOptionChoose={(val) => this.setState({sehatId: val})}
                    hasHelper={false}
                    style={{
                      backgroundColor:
                        this.state.sehatId != null
                          ? 'transparent'
                          : colors.yello,
                      color: this.state.sehatId ? 'grey' : 'black',
                      borderWidth: 0.4,
                      // borderColor: colors.deepgrey,
                      marginHorizontal: 20,
                      height: this.state.sehatId != null ? 45 : 40,
                      width: width - 3 * h_margin,
                      alignSelf: 'center',
                      marginTop: 10,
                    }}
                  />
                  <View style={{height: spacer}} />
                  <FillForm
                    label="Mengkonsumsi obat"
                    mode="contained"
                    value={
                      this.state.obatId != null &&
                      this.state.obatOptions[this.state.obatId].name
                    }
                    optionData={this.state.obatOptions}
                    useIndexReturn={true}
                    onOptionChoose={(val) => this.setState({obatId: val})}
                    hasHelper={false}
                    style={{
                      backgroundColor:
                        this.state.obatId != null
                          ? 'transparent'
                          : colors.yello,
                      color: this.state.obatId ? 'grey' : 'black',
                      borderWidth: 0.4,
                      // borderColor: colors.deepgrey,
                      marginHorizontal: 20,
                      height: this.state.obatId != null ? 45 : 40,
                      width: width - 3 * h_margin,
                      alignSelf: 'center',
                      marginTop: 10,
                    }}
                  />
                </View>

                {this.state.obatId === null ||
                this.state.sehatId === null ||
                this.state.image === null ||
                this.state.lokasiId === null ||
                this.state.jamId === null ? (
                  <View>
                    <Text />
                  </View>
                ) : (
                  <View style={{marginTop: 15}}>
                    <Text
                      style={{
                        paddingHorizontal: 30,
                        color: 'grey',
                        fontSize: 16,
                      }}>
                      Pernyataan di atas saya buat dengan sebenar-benarnya
                      sebagai dasar pertimbangan atasan untuk menilai kesiapan
                      saya dalam bekerja dan mengoperasikan alat dengan aman.
                      Saya bersedia menerima sanksi sesuai Peraturan Perusahaan
                      apabila terbukti memalsukan pernyataan diatas .
                    </Text>

                    {this.state.keyboardState === 'closed' && (
                      <View
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 50,
                          width: 250,
                          borderRadius: 25,
                          backgroundColor: 'transparent',
                          marginVertical: 30,
                        }}>
                        <FAB
                          color={Colors.white}
                          label={'Setuju & Kirim'}
                          style={{
                            height: 50,
                            // elevation: 3,
                            backgroundColor: '#F79F1F',
                            width: width - 3 * h_margin,
                          }}
                          icon={({size, color}) => (
                            <Icons name={'send'} size={size} color={color} />
                          )}
                          onPress={() => {
                            this.handleKirim();
                          }}
                        />
                      </View>
                    )}
                  </View>
                )}
                <View style={{height: height / 5}} />
              </ScrollView>
            </>
          )}
        </View>

        <RBSheet
          customStyles={{
            container: {
              borderRadius: 10,
              width: width / 4,
              bottom: height / 2.8,
              left: 50,
              backgroundColor: 'transparent',
            },
          }}
          animationType={'fade'}
          height={height / 3}
          closeOnDragDown
          ref={(ref) => {
            this.RBSheet = ref;
          }}>
          <View
            style={{
              width: 300,
              flexDirection: 'row',
              height: height / 10,
              backgroundColor: 'yellow',
              justifyContent: 'center',
              alignSelf: 'center',
              borderRadius: 50,
            }}>
            <View
              style={{
                width: width / 2.5,
                height: height / 10,
                backgroundColor: '#4b6584',
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={{
                  width: 70,
                }}
                onPress={this.takeImage}>
                <FeatherIcons
                  name="camera"
                  size={70}
                  color={Colors.white}
                  alignSelf="right"
                />
              </TouchableOpacity>
            </View>
          </View>
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
      </>
    );
  }
}

const styles = StyleSheet.create({
  timewrapper: {
    elevation: 0,
    marginTop: 15,
    borderRadius: 20,
    color: 'orange',
    height: 40,
  },
  unfit: {
    width: 110,
    borderWidth: 0.5,
    borderColor: 'red',
    backgroundColor: 'red',
    borderRadius: 20,
    alignItems: 'center',
    // alignSelf: 'center',
    marginVertical: 10,
    height: 30,
    justifyContent: 'center',
  },
  fit: {
    width: 100,
    borderWidth: 0.5,
    borderColor: 'green',
    backgroundColor: 'green',
    color: 'white',
    borderRadius: 20,
    alignItems: 'center',
    // alignSelf: 'center',
    marginVertical: 15,
    height: 30,
    justifyContent: 'center',
  },
  observe: {
    width: 150,
    borderWidth: 0.5,
    borderColor: 'yellow',
    backgroundColor: 'yellow',
    borderRadius: 20,
    alignItems: 'center',
    // alignSelf: 'center',
    marginVertical: 15,
    height: 30,
    justifyContent: 'center',
  },
  textinput: {
    width: width - 3 * h_margin,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    // justifyContent: 'flex-start',
    // backgroundColor: 'white',
    borderColor: 'grey',
    marginVertical: 5,
    // paddingLeft: 20,
    height: 45,
    borderRadius: 15,
  },
});

FitToWorkScreen.contextType = AppContext;

export default FitToWorkScreen;
