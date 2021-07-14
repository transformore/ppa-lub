import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  TouchableNativeFeedback,
  Alert,
  Keyboard,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {Colors, Appbar, TextInput, Title} from 'react-native-paper';

import {ScrollView} from 'react-native-gesture-handler';
// import { AppExt } from "../utils";
import ImagePicker from 'react-native-image-crop-picker';
import FeatherIcons from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import Axios from 'axios';
// import DatePicker from "react-native-datepicker";
import {LoadingIndicator, ErrorData, InputOption} from '../components';
import {AppContext} from '../context';
import Modal from 'react-native-modal';

const {width, height} = Dimensions.get('screen');

export class HazardTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      refreshing: false,
      requestError: false,

      ktaId: null,
      detailKta: '',
      lokasiId: null,
      detailLokasi: '',
      deptId: null,
      picId: null,
      isPicLoading: true,
      kodeBahaya: '',
      status: '',
      tindakanPerbaikan: '',
      image: null,
      ktaOptions: null,
      lokasiOptions: null,
      deptOptions: null,
      picOptions: null,
      keyboardState: 'closed',
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

    this.getHazardData();
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

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

  getHazardData = () => {
    this.setState({loading: true});
    Axios.get('/hazardForm')
      .then((res) => {
        // alert(JSON.stringify(res.data));
        const formattedKta = res.data.kta.map((item, index) => ({
          id: index,
          code: item.id,
          name: item.kta,
        }));
        const formattedLokasi = res.data.lokasi.map((item, index) => ({
          id: index,
          code: item.id,
          name: item.lokasi,
        }));
        const formattedDept = res.data.dept.map((item, index) => ({
          id: index,
          name: item,
        }));

        this.setState({
          loading: false,
          refreshing: false,
          requestError: false,

          ktaOptions: formattedKta,
          lokasiOptions: formattedLokasi,
          deptOptions: formattedDept,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          refreshing: false,
          requestError: true,
        });
        alert('Terjadi kesalahan: ' + error);
      });
  };

  handleSetDept = (id) => {
    this.setState({deptId: id, picId: null});
    this.getPicData(this.state.deptOptions[id].name);
  };

  getPicData = (dept) => {
    this.setState({isPicLoading: true});
    Axios.get(`/namaByDept/${dept}`)
      .then((res) => {
        // alert(JSON.stringify(res.data));
        const formattedPic = res.data.map((item, index) => ({
          id: index,
          nrp: item.nrp,
          name: item.nama,
        }));

        this.setState({
          isPicLoading: false,
          picOptions: formattedPic,
        });
      })
      .catch((error) => {
        this.setState({
          isPicLoading: false,
          deptId: null,
        });
        alert('PIC Error: ' + error);
      });
  };

  handleKirim = () => {
    if (
      this.state.ktaId == null ||
      this.state.lokasiId == null ||
      this.state.deptId == null ||
      this.state.picId == null ||
      !this.state.kodeBahaya ||
      !this.state.status
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
        ktaId,
        // detailKta,
        lokasiId,
        // detailLokasi,
        deptId,
        picId,
        kodeBahaya,
        // status,
        tindakanPerbaikan,
        ktaOptions,
        lokasiOptions,
        deptOptions,
        picOptions,
      } = this.state;

      var data = new FormData();
      data.append('nrp', this.context.userData.nrp);
      data.append('kta', ktaOptions[ktaId].code);
      data.append('lokasi', lokasiOptions[lokasiId].code);
      data.append('kode', kodeBahaya);
      data.append('pic_dept', deptOptions[deptId].name);
      data.append('pic_nrp', picOptions[picId].nrp);
      data.append('perbaikan', tindakanPerbaikan);
      data.append('is_public', this.context.isPublicNetwork);
      data.append('evidence', {
        uri: this.state.image.path,
        type: this.state.image.mime,
        name: 'image.jpg',
      });

      Axios.post('/hazard', data, {
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
                onPress: () => this.props.navigation.goBack(),
              },
            ],
            {onDismiss: () => this.props.navigation.goBack()},
          );
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

  // pickImage = () => {
  //   ImagePicker.openPicker({
  //     freeStyleCropEnabled: true,
  //     cropping: true,
  //     compressImageQuality: 0.1,
  //   })
  //     .then((image) => {
  //       this.setState({image: image});
  //       this.RBSheet.close();
  //     })
  //     .catch(() => {});
  // };
  takeImage = () => {
    // this.RBSheet.close();
    ImagePicker.openCamera({
      width: width - 40,
      height: height / 4,
      freeStyleCropEnabled: true,
      compressImageQuality: 0.1,
      cropping: true,
    })
      .then((image) => {
        this.setState({image: image});
        this.RBSheet.close();
      })
      .catch(() => {});
  };
  render() {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          translucent={false}
          backgroundColor={'#0F4C75'}
        />

        <Appbar.Header style={{zIndex: 3}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Laporan Bahaya" />
        </Appbar.Header>
        <View>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => this.RBSheet.open()}>
            <View
              style={{
                height: height / 4,
                width: width - 40,
                // marginHorizontal: 20,
                borderStyle: this.state.image == null ? 'dashed' : 'solid',
                borderRadius: 10,
                borderWidth: this.state.image == null ? 1.7 : 1,
                borderColor:
                  this.state.image == null ? Colors.grey500 : Colors.grey500,
                backgroundColor:
                  this.state.image == null ? Colors.grey200 : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              {this.state.image == null ? (
                <>
                  <FeatherIcons
                    name={'upload'}
                    size={30}
                    color={Colors.grey500}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      color: Colors.grey500,
                      marginTop: 5,
                    }}>
                    Unggah Bukti
                  </Text>
                </>
              ) : (
                <Image
                  style={{
                    flex: 1,
                    width: '100%',
                    height: '120%',
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

          <RBSheet
            customStyles={{
              container: {
                borderRadius: 10,
                width: (width * 2) / 3,
                bottom: (height * 3) / 4.5,
                left: width / 6,
                backgroundColor: 'transparent',
              },
            }}
            animationType={'fade'}
            height={height / 6}
            closeOnDragDown
            ref={(ref) => {
              this.RBSheet = ref;
            }}>
            <View
              style={{
                width: 400,
                flexDirection: 'row',
                height: 120,
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  width: 140,
                  height: 110,
                  backgroundColor: '#4b6584',
                  borderRadius: 20,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={{
                    width: 100,
                  }}
                  onPress={this.takeImage}>
                  <FeatherIcons
                    name="camera"
                    size={100}
                    color={Colors.white}
                    alignSelf="right"
                  />
                </TouchableOpacity>
              </View>
              {/* <View style={{width: 75}} />
              <View
                style={{
                  width: 100,
                  backgroundColor: '#26de81',
                  borderRadius: 20,
                }}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={{
                    width: 100,
                  }}
                  onPress={this.pickImage}>
                  <FeatherIcons
                    name="image"
                    size={100}
                    color={Colors.white}
                    alignSelf="center"
                  />
                </TouchableOpacity>
              </View> */}
            </View>
          </RBSheet>
        </View>
        <View style={{flex: 1}}>
          {this.state.loading ? (
            <LoadingIndicator />
          ) : // <View
          //   style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          //   <ActivityIndicator
          //     animating
          //     size={'large'}
          //     color={Colors.red500}
          //   />
          // </View>
          this.state.requestError ? (
            <ErrorData onRetry={this.getHazardData} />
          ) : (
            <>
              <ScrollView style={{flex: 1}}>
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingtop: 10,
                    // backgroundColor: 'blue',
                  }}>
                  <InputOption
                    mode="contained"
                    label="Kepada Dept "
                    value={
                      this.state.deptId != null &&
                      this.state.deptOptions[this.state.deptId].name
                    }
                    optionData={this.state.deptOptions}
                    useIndexReturn={true}
                    onOptionChoose={(val) => this.handleSetDept(val)}
                    hasHelper={false}
                    style={{
                      marginbottom: 5,
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                      color: Colors.blue700,
                    }}
                  />
                  {this.state.deptId != null && (
                    <InputOption
                      label="Lokasi"
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
                        marginBottom: 5,
                        borderWidth: 0,
                      }}
                    />
                  )}
                  {this.state.lokasiId != null && (
                    <TextInput
                      selectionColor="red"
                      mode="contained"
                      style={{
                        marginbottom: 5,
                        backgroundColor: 'transparent',
                        color: Colors.blue700,
                      }}
                      label="Detail Lokasi"
                      placeholder="Isikan lokasi kejadian"
                      value={this.state.detailLokasi}
                      onChangeText={(text) =>
                        this.setState({detailLokasi: text})
                      }
                    />
                  )}
                  {this.state.lokasiId != null && (
                    <InputOption
                      label="Kategori"
                      value={
                        this.state.ktaId != null &&
                        this.state.ktaOptions[this.state.ktaId].name
                      }
                      optionData={this.state.ktaOptions}
                      useIndexReturn={true}
                      onOptionChoose={(val) => this.setState({ktaId: val})}
                      hasHelper={false}
                      style={{
                        marginbottom: 5,
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        color: Colors.blue700,
                      }}
                      isSearchable={true}
                    />
                  )}
                  {this.state.lokasiId != null && (
                    <TextInput
                      selectionColor="red"
                      mode="contained"
                      style={{
                        marginbottom: 5,
                        backgroundColor: 'transparent',
                        color: Colors.blue700,
                      }}
                      label="Detail KTA"
                      placeholder="Kodisi atau tidakan tidak aman yang ditemui"
                      value={this.state.detailKta}
                      onChangeText={(text) => this.setState({detailKta: text})}
                    />
                  )}
                  {this.state.lokasiId != null && (
                    <InputOption
                      label="PIC"
                      value={
                        this.state.picId != null &&
                        this.state.picOptions[this.state.picId].name
                      }
                      optionData={this.state.picOptions}
                      useIndexReturn={true}
                      onOptionChoose={(val) => this.setState({picId: val})}
                      hasHelper={false}
                      style={{
                        marginbottom: 5,
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                        color: Colors.blue700,
                      }}
                      isLoading={this.state.isPicLoading}
                      isSearchable={true}
                    />
                  )}
                  {this.state.lokasiId != null && (
                    <InputOption
                      label="Kode Bahaya"
                      value={this.state.kodeBahaya}
                      optionData={[
                        {
                          name: 'High',
                          value: 'H',
                          mcIcon: 'circle-slice-8',
                        },
                        // {
                        //   name: "Severity",
                        //   value: "S",
                        //   mcIcon: "circle-slice-6",
                        // },
                        {
                          name: 'Medium',
                          value: 'M',
                          mcIcon: 'circle-slice-4',
                        },
                        {
                          name: 'Low',
                          value: 'L',
                          mcIcon: 'circle-slice-2',
                        },
                      ]}
                      onOptionChoose={(val) => this.setState({kodeBahaya: val})}
                      hasHelper={false}
                      style={{
                        marginbottom: 5,
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                        color: Colors.blue700,
                      }}
                    />
                  )}
                  {this.state.lokasiId != null && (
                    <TextInput
                      selectionColor="red"
                      mode="contained"
                      multiline
                      style={{
                        marginbottom: 5,
                        backgroundColor: 'transparent',
                      }}
                      label="Tindakan Perbaikan"
                      placeholder="Tindakan Perbaikan"
                      value={this.state.tindakanPerbaikan}
                      onChangeText={(text) =>
                        this.setState({tindakanPerbaikan: text})
                      }
                    />
                  )}
                  {this.state.lokasiId != null && (
                    <InputOption
                      label="Status"
                      value={this.state.status}
                      optionData={[
                        {name: 'Open', mcIcon: 'package-variant'},
                        {
                          name: 'Close',
                          mcIcon: 'package-variant-closed',
                        },
                      ]}
                      onOptionChoose={(val) => this.setState({status: val})}
                      hasHelper={false}
                      style={{
                        marginbottom: 5,
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                        color: Colors.blue700,
                      }}
                    />
                  )}
                </View>
                {this.state.status !== '' &&
                  this.state.tindakanPerbaikan !== '' &&
                  this.state.detailKta !== '' &&
                  this.state.kodeBahaya !== '' &&
                  this.state.detailLokasi !== '' && (
                    <TouchableNativeFeedback onPress={this.handleKirim}>
                      <View
                        style={{
                          height: 50,
                          width: 300,
                          borderRadius: 25,
                          backgroundColor: Colors.orange700,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          marginTop: 20,
                        }}>
                        <Title style={{color: Colors.white}}>Submit</Title>
                      </View>
                    </TouchableNativeFeedback>
                  )}
                <View style={{height: 350}} />
              </ScrollView>
            </>
          )}
        </View>
      </>
    );
  }
}

HazardTest.contextType = AppContext;
export default HazardTest;
