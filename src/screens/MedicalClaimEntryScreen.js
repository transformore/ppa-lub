import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  TouchableNativeFeedback,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import {
  Colors,
  Appbar,
  Title,
  ActivityIndicator,
  Divider,
  Button,
} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import Axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {LoadingIndicator, ErrorData, InputOption} from '../components';
import {AppContext} from '../context';
import Modal from 'react-native-modal';
import {AppExt} from '../utils';
import ImagePicker from 'react-native-image-crop-picker';
import FeatherIcons from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
const {width, height} = Dimensions.get('screen');
const h_margin = 15;

export class MedicalClaimEntryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      requestError: false,
      isTglBerobatVisible: false,
      idClaim: '',
      jenisClaimId: null,
      namaPasien: '',
      tglBerobat: new Date(),
      nilaiClaim: '',
      maxClaim: '',
      gender: null,
      maritalStatus: null,

      jenisClaimOptions: null,
      hubunganId: null,
      hubunganOptions: null,
      isHubLoading: false,

      subClaimId: null,
      subClaimOptions: 'na',
      isSubClaimLoading: false,

      pasienId: null,
      isPasienLoading: false,

      keyboardState: 'closed',

      image: null,

      nama: '',
    };
  }

  getClaimState = () => {
    Alert(this.state.jenisClaimId);
  };

  goBack = () => {
    this.props.route.params.onGoBack();
    this.props.navigation.goBack();
  };

  showTglBerobat = () => {
    this.setState({isTglBerobatVisible: true});
  };
  hideTglBerobat = () => {
    this.setState({isTglBerobatVisible: false});
  };
  setNilaiClaim = (nilaiClaim, maxClaim) => {
    this.setState({nilaiClaim: nilaiClaim});
    this.setState({maxClaim: nilaiClaim});
  };

  // setPasien = (namaPasien) => {
  //   this.setState({namaPasien: namaPasien});
  // };

  componentDidMount() {
    this.getClaimData();
  }

  getClaimData = () => {
    this.setState({loading: true});
    Axios.get(`/claimForm/${this.context.userData.nrp}`)
      .then((res) => {
        const formattedJenis = res.data.jenis.map((item, index) => ({
          id: index,
          code: item.id,
          name: item.jenis,
        }));
        this.setState({
          loading: false,
          refreshing: false,
          requestError: false,

          jenisClaimOptions: formattedJenis,

          nama: this.context.userData.nrp + '-' + this.context.userData.nama,
          idClaim: res.data.id_claim,

          plafon: {
            plafonLalu: res.data.plafon.plafon_last,
            plafonSkrg: res.data.plafon.plafon_current,
          },

          gender: res.data.user.gender,
          maritalStatus: res.data.user.maritalStatus,
        });
      })
      .catch((e) => {
        this.setState({
          loading: false,
          refreshing: false,
          requestError: true,
        });
        console.warn(e);
      });
  };

  getHubunganData = (claimCode) => {
    this.setState({isHubLoading: true});
    Axios.post('/claimHub', {
      nrp: this.context.userData.nrp,
      jenis_claim: claimCode,
      jenis_kelamin: this.state.gender,
      maritalStatus: this.state.maritalStatus,
    })
      .then((res) => {
        const formattedHubungan = res.data.data.map((item, index) => ({
          id: index,
          code: item.id,
          name: item.hubungan,
        }));
        this.setState({
          isHubLoading: false,
          hubunganOptions: formattedHubungan,
        });
        // alert(JSON.stringify(this.state.hubunganOptions));
      })
      .catch((e) => {
        this.setState({
          isHubLoading: false,
        });
        console.warn(e);
      });
  };
  getPasienData = (kode_hub) => {
    this.setState({isPasienLoading: true});
    Axios.post('/claimPasien', {
      nrp: this.context.userData.nrp,
      kode_hub: kode_hub,
    })
      .then((res) => {
        // this.setPasien(res.data.pasien);
        this.setState({
          namaPasien: res.data.pasien,
          isPasienLoading: false,
          // hubunganOptions: formattedHubungan,
        });
        // alert(this.state.pasien);
      })
      .catch((e) => {
        this.setState({
          isPasienLoading: false,
        });
        console.warn(e);
      });
  };

  getSubClaimData = (claimCode) => {
    this.setState({isSubClaimLoading: true});
    Axios.post('/claimSubClaim', {
      nrp: this.context.userData.nrp,
      kode_claim: claimCode,
    })
      .then((res) => {
        const formattedSubClaim = res.data.data.map((item, index) => ({
          id: index,
          code: item.idjenis,
          name: item.jenis,
          nominal: item.nominal,
          description: AppExt.toRupiah(item.nominal, 'Rp.'),
        }));
        this.setState({
          isSubClaimLoading: false,
          subClaimOptions: formattedSubClaim,
        });
        // alert(
        //   JSON.stringify(this.state.subClaimOptions[claimCode].description),
        // );
      })
      .catch((e) => {
        this.setState({
          isSubClaimLoading: false,
        });
        console.warn(e);
      });
  };

  getTanggalBerobat = () => {
    let tanggal = new Date(this.state.tglBerobat);
    // console.warn(typeof tanggal);
    return `${tanggal.getFullYear()}-${tanggal.getMonth() + 1 < 10 ? '0' : ''}${
      tanggal.getMonth() + 1
    }-${tanggal.getDate() < 10 ? '0' : ''}${tanggal.getDate()}`;
  };

  tglBerobatConfirm = (date) => {
    // console.warn(typeof date);
    this.setState({
      tglBerobat: date,
    });
    this.hideTglBerobat();
  };
  hideTglBerobat = () => {
    this.setState({isTglBerobatVisible: false});
  };

  handleSetItem = (id) => {
    this.setState({deptId: id, picId: null});
  };
  handleKirim = () => {
    const sisaplafon = parseFloat(this.state.plafon.plafonSkrg);
    const nilaiclaim = parseFloat(this.state.nilaiClaim);
    const maxclaim = parseFloat(this.state.maxClaim);

    if (
      this.state.image == null ||
      this.state.jenisClaimId == null ||
      this.state.hubunganId == null ||
      this.state.nama == null ||
      this.state.nilaiClaim == null ||
      this.state.tglBerobat == null ||
      ((this.state.jenisClaimOptions[this.state.jenisClaimId].code == 'LEN' ||
        this.state.jenisClaimOptions[this.state.jenisClaimId].code == 'SCH') &&
        this.state.subClaimId == null)
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
      if (
        ((this.state.jenisClaimId == 0 || this.state.jenisClaimId == 1) &&
          nilaiclaim > sisaplafon) ||
        nilaiclaim > maxclaim
      ) {
        Alert.alert(
          'Oops!',
          'Nilai claim melebihi batas maks.',
          [
            {
              text: 'OK',
              onPress: () => null,
            },
          ],
          {onDismiss: () => null},
        );
      } else {
        //   alert('Success !!');
        // }
        this.context.setLoading(true);
        const {
          jenisClaimId,
          subClaimId,
          hubunganId,
          jenisClaimOptions,
          subClaimOptions,
          hubunganOptions,
        } = this.state;
        var data = new FormData();
        data.append('id_claim', this.state.idClaim);
        data.append('nama', this.state.namaPasien);
        data.append('kode_hub', hubunganOptions[hubunganId].code);
        data.append('kode_claim', jenisClaimOptions[jenisClaimId].code);
        data.append('amount', this.state.nilaiClaim);
        data.append(
          'tgl_kwitansi',
          this.getTanggalBerobat(this.state.tglBerobat),
        );
        data.append('is_public', this.context.isPublicNetwork);
        data.append('receipt', {
          uri: this.state.image.path,
          type: this.state.image.mime,
          name: 'image.jpg',
        });
        {
          subClaimId == null
            ? data.append('sub_claim', subClaimOptions)
            : data.append('sub_claim', subClaimOptions[subClaimId].code);
        }

        Axios.post('/claimItem', data, {
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
                  onPress: () => {
                    this.goBack();
                    // this.props.route.params.goBack();
                    // this.props.navigation.goBack();
                  },
                },
              ],
              {
                onDismiss: () => {
                  this.goBack();
                  // // this.props.navigation.state.params.onGoBack();
                  // // this.props.navigation.goBack();
                  // this.props.route.params.goBack();
                  // this.props.navigation.goBack();
                },
              },
            );
          })
          .catch((error) => {
            this.context.setLoading(false);
            Alert.alert(
              // 'Oops!',
              // JSON.stringify(error),
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
    }
  };

  pickImage = () => {
    // this.RBSheet.close();
    ImagePicker.openPicker({
      height: width / 3,
      width: width - 2 * h_margin,
      freeStyleCropEnabled: true,
      cropping: true,
      compressImageQuality: 0.1,
    })
      .then((image) => {
        this.setState({image: image});
        this.RBSheet.close();
      })
      .catch(() => {});
  };

  takeImage = () => {
    // this.RBSheet.close();
    ImagePicker.openCamera({
      // height: height,
      // width: width,
      freeStyleCropEnabled: true,
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
          backgroundColor={'#0F4C75'}
          translucent={false}
        />

        <Appbar.Header style={{zIndex: 3}}>
          <Appbar.BackAction onPress={this.goBack} />
          <Appbar.Content title="Formulir Claim" />
        </Appbar.Header>

        <View style={{flex: 1, backgroundColor: Colors.grey200}}>
          {this.state.loading ? (
            <LoadingIndicator />
          ) : this.state.requestError ? (
            <ErrorData onRetry={this.getClaimData} />
          ) : (
            <ScrollView style={{flex: 1}}>
              <View
                style={{
                  paddingHorizontal: 13,
                  paddingBottom: 0,
                  backgroundColor: Colors.white,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 20,
                    alignSelf: 'center',
                  }}>
                  <Text> NOMOR CLAIM : </Text>
                  <Text> {this.state.idClaim}</Text>
                </View>
                {/* <View>
                  <Text>{this.state.gender}</Text>
                  <Text>{this.state.maritalStatus}</Text>
                  <Text>{this.state.jenisClaimId}</Text>
                  <Text>{this.context.userData.nrp}</Text>
                </View> */}
                <InputOption
                  label="Jenis Claim"
                  value={
                    this.state.jenisClaimId != null &&
                    this.state.jenisClaimOptions[this.state.jenisClaimId].name
                  }
                  optionData={this.state.jenisClaimOptions}
                  useIndexReturn={true}
                  onOptionChoose={(val) =>
                    this.setState({jenisClaimId: val}, () => {
                      if (
                        this.state.jenisClaimOptions[this.state.jenisClaimId]
                          .code === 'LEN' ||
                        this.state.jenisClaimOptions[this.state.jenisClaimId]
                          .code === 'SCH'
                      ) {
                        this.getSubClaimData(
                          this.state.jenisClaimOptions[this.state.jenisClaimId]
                            .code,
                        );
                      }
                      // alert(this.state.jenisClaimId);
                      // alert(
                      //   this.state.jenisClaimOptions[this.state.jenisClaimId]
                      //     .code,
                      // );
                      this.getHubunganData(
                        this.state.jenisClaimOptions[this.state.jenisClaimId]
                          .code,
                      );
                    })
                  }
                  hasHelper={false}
                  style={styles.optiontext}
                  isSearchable={true}
                />
                {this.state.jenisClaimId != null &&
                  (this.state.jenisClaimOptions[this.state.jenisClaimId].code ==
                    'LEN' ||
                    this.state.jenisClaimOptions[this.state.jenisClaimId]
                      .code == 'SCH') && (
                    <InputOption
                      label="Sub Claim"
                      isLoading={this.state.isSubClaimLoading}
                      value={
                        this.state.subClaimId != null &&
                        this.state.subClaimOptions[this.state.subClaimId].name
                      }
                      optionData={this.state.subClaimOptions}
                      useIndexReturn={true}
                      onOptionChoose={(val) =>
                        this.setState(
                          {
                            subClaimId: val,
                          },
                          () => {
                            this.setNilaiClaim(
                              this.state.subClaimOptions[this.state.subClaimId]
                                .nominal,
                            );
                            // alert(
                            //   this.state.subClaimOptions[this.state.subClaimId]
                            //     .description,
                            // );
                            // alert(this.state.subClaimId);
                          },
                        )
                      }
                      hasHelper={false}
                      style={styles.optiontext}
                    />
                  )}
                {this.state.jenisClaimId != null && (
                  <InputOption
                    label="Hub Keluarga"
                    isLoading={this.state.isHubLoading}
                    // value={
                    //   this.state.hubunganId != null &&
                    //   this.state.hubunganOptions[this.state.hubunganId].name
                    // }
                    optionData={this.state.hubunganOptions}
                    useIndexReturn={true}
                    onOptionChoose={(val) =>
                      this.setState(
                        {
                          hubunganId: val,
                          //   val === 0 ? this.context.userData.nama : '',
                        },
                        () => {
                          this.getPasienData(
                            this.state.hubunganOptions[this.state.hubunganId]
                              .code,
                          );
                        },
                      )
                    }
                    hasHelper={false}
                    style={styles.optiontext}
                  />
                )}
                <View
                  pointerEvents={this.state.hubunganId == 0 ? 'none' : 'auto'}>
                  <TextInput
                    // disabled={this.state.hubunganId == null}
                    mode="contained"
                    // style={{marginBottom: 10, backgroundColor: 'transparent'}}
                    style={styles.optiontext}
                    label="Nama Pasien"
                    // placeholder={this.state.namaPasien}
                    value={this.state.namaPasien}
                    onChangeText={(text) => this.setState({namaPasien: text})}
                  />
                </View>
                <View style={{alignSelf: 'center'}}>
                  <Text style={{marginTop: 5}}>Tanggal Kwitansi/Berobat</Text>
                  <View style={{}}>
                    <Button
                      onPress={this.showTglBerobat}
                      mode="contained"
                      color={Colors.transparent}
                      // style={styles.timewrapper}
                      style={styles.inputtext}
                      loading={false}>
                      {!this.state.tglBerobat ? '' : this.getTanggalBerobat()}
                    </Button>
                    <DateTimePickerModal
                      isVisible={this.state.isTglBerobatVisible}
                      mode="date"
                      onConfirm={this.tglBerobatConfirm}
                      onCancel={this.hideTglBerobat}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => this.takeImage()}>
                  {/* onPress={() => this.RBSheet.open()}> */}
                  <View
                    style={{
                      marginVertical: 10,
                      height: height / 4,
                      width: width - 2 * h_margin,
                      padding: 5,
                      borderStyle:
                        this.state.image == null ? 'dashed' : 'solid',
                      borderRadius: 17,
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
                    }}>
                    {this.state.image == null ? (
                      <>
                        <FeatherIcons
                          name={'camera'}
                          size={80}
                          color={Colors.grey500}
                        />
                        <Text
                          style={{
                            fontSize: 17,
                            color: Colors.grey500,
                            marginTop: 5,
                          }}>
                          Foto Nota/Kwitansi
                        </Text>
                      </>
                    ) : (
                      <Image
                        style={{
                          flex: 1,
                          width: '100%',
                          height: '100%',
                          resizeMode: 'cover',
                          borderRadius: 13,
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
                <View
                  style={{
                    flexDirection: 'row',
                    // marginHorizontal: h_margin,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    width: width - h_margin * 2,
                  }}>
                  <View pointerEvents="none">
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: width / 2 - h_margin,
                      }}>
                      <View style={{alignItems: 'center'}}>
                        <Text>Sisa Plafon </Text>
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <TextInput
                          mode="contained"
                          style={styles.disabletext}
                          label="Sisa Plafon"
                          value={AppExt.toRupiah(
                            this.state.plafon.plafonSkrg,
                            'Rp. ',
                          )}
                          height={50}
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: width / 2 - h_margin,
                      // marginLeft: 10,
                    }}>
                    <View>
                      <Text>Nilai Claim </Text>
                    </View>
                    <TextInput
                      disabled={this.state.nilaiClaim == null}
                      mode="cotained"
                      style={styles.inputtext}
                      label="Nilai Claim"
                      placeholder="Tanpa pemisah ribuan !"
                      value={this.state.nilaiClaim}
                      keyboardType="numeric"
                      onChangeText={(text) => this.setState({nilaiClaim: text})}
                    />
                  </View>
                </View>
                <View>
                  <TouchableNativeFeedback onPress={() => this.handleKirim()}>
                    <View
                      style={{
                        marginTop: 35,
                        width: width - 2 * h_margin,
                        height: 50,
                        backgroundColor: '#F79F1F',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 25,
                      }}>
                      <Title style={{color: Colors.white}}>Tambah</Title>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
              <View style={{height: 300}} />
              <Divider style={{height: 1.5}} />
            </ScrollView>
          )}
        </View>

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

        <RBSheet
          customStyles={{
            container: {
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
            },
          }}
          animationType={'fade'}
          closeOnDragDown
          height={200}
          ref={(ref) => {
            this.RBSheet = ref;
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 35,
              borderTopRightRadius: 35,
              marginBottom: 10,
            }}>
            <FeatherIcons name="minus" size={75} color={Colors.grey300} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 20,
              marginBottom: 20,
              flex: 1,
            }}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={{
                flex: 1,
              }}
              onPress={this.takeImage}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: Colors.green300,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'column'}}>
                  <FeatherIcons name="camera" size={75} color={Colors.white} />
                </View>
              </View>
            </TouchableOpacity>
            <View style={{width: 15}} />
            <TouchableOpacity
              activeOpacity={0.75}
              style={{
                flex: 1,
              }}
              onPress={this.pickImage}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: Colors.cyan400,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FeatherIcons name="image" size={75} color={Colors.white} />
              </View>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </>
    );
  }
}

const styles = {
  inputtext: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderColor: '#0984e3',
    // borderColor: '#F79F1F',
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width / 2 - h_margin,
    height: width / 8,
    marginVertical: 5,
    elevation: 0,
  },
  optiontext: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 25,
    // borderColor: '#0984e3',
    borderColor: '#F79F1F',
    // backgroundColor: '#81ecec',
    backgroundColor: '#dff9fb',
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width - 2 * h_margin,
    height: width / 8,
    marginVertical: 5,
    elevation: 0,
  },
  disabletext: {
    elevation: 0,
    marginVertical: 5,
    paddingHorizontal: 25,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width / 2 - 2 * h_margin,
    borderColor: 'grey',
    backgroundColor: 'grey',
    color: 'white',
  },
};

MedicalClaimEntryScreen.contextType = AppContext;
export default MedicalClaimEntryScreen;
