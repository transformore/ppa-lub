import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  TouchableNativeFeedback,
  Alert,
} from 'react-native';
import {
  Colors,
  Appbar,
  TextInput,
  Title,
  Subheading,
  Caption,
  Divider,
  HelperText,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import Axios from 'axios';
import DatePicker from 'react-native-datepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {LoadingIndicator, ErrorData} from '../components';
import {AppContext} from '../context';
import Modal from 'react-native-modal';

export class LeavingEntryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      refreshing: false,
      requestError: false,
      isTglBawaKlgVisible: false,
      isTglAwalCutiVisible: false,
      tglBawa: new Date(),
      nama: '',
      statusPerkawinan: '',
      tglBergabung: '',
      posisi: '',
      alamat: '',
      penerimaan: '',
      email: '',
      appr_group: '',
      membawaKeluarga: {
        isMembawa: false,
        tglAwal: new Date(),
      },
      awalCuti: new Date(),
      cuti: {
        tglAwal: '',
        jumlahHari: {
          lapangan: '0',
          tahunan: '0',
          seminarTraining: '0',
          besar: '0',
          istirahat: '0',
        },
        saldo: {
          tahunan: null,
          besar: null,
        },
      },
    };

    this.lastCuti = {
      berangkat: null,
      kembali: null,
    };
  }
  goBack = () => {
    this.props.route.params.onGoBack();
    this.props.navigation.goBack();
  };

  showTglBawaKlg = () => {
    this.setState({isTglBawaKlgVisible: true});
  };
  showTglAwalCuti = () => {
    this.setState({isTglAwalCutiVisible: true});
  };

  hideTglBawaKlg = () => {
    this.setState({isTglBawaKlgVisible: false});
  };
  hideTglAwalCuti = () => {
    this.setState({isTglAwalCutiVisible: false});
  };

  tglBawaKlgConfirm = (date) => {
    console.warn(typeof date);
    this.setState({
      membawaKeluarga: {
        ...this.state.membawaKeluarga,
        tglAwal: date,
      },
    });
    this.hideTglBawaKlg();
  };
  tglAwalCutiConfirm = (date) => {
    console.warn(typeof date);
    this.setState({
      awalCuti: date,

      // cuti: {
      //   ...this.state.cuti,
      //   tglAwal: date,
      // },
    });
    this.hideTglAwalCuti();
  };

  componentDidMount() {
    this.getLeavingData();
  }

  getLeavingData = () => {
    this.setState({loading: true});
    Axios.get(`/cutiForm/${this.context.userData.nrp}`)
      .then((res) => {
        // alert(JSON.stringify(res.data));
        if (res.data.is_applicable) {
          this.setState({
            loading: false,
            refreshing: false,
            requestError: false,

            nama: res.data.data.personal.nama,
            statusPerkawinan: res.data.data.personal.maritalStatus,
            tglBergabung: res.data.data.personal.hiringDate,
            posisi: res.data.data.personal.jabatan,
            alamat: res.data.data.personal.alamat,
            penerimaan: res.data.data.personal.poh,
            email: res.data.data.personal.email,
            appr_group: res.data.data.personal.appr_group,

            cuti: {
              ...this.state.cuti,
              jumlahHari: {...this.state.cuti.jumlahHari},
              saldo: {
                tahunan: res.data.data.saldo.c_tahunan,
                besar: res.data.data.saldo.c_besar,
              },
            },
          });
          this.lastCuti = res.data.data.lastCuti;
        } else {
          Alert.alert(
            'Oops!',
            'Anda sudah mengajukan cuti sebelumnya.',
            [
              {
                text: 'OK',
                onPress: () => this.goBack(),
              },
            ],
            {onDismiss: () => this.goBack()},
          );
        }
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

  validateJumlahHariCuti = (field) => {
    const {
      lapangan,
      tahunan,
      seminarTraining,
      besar,
      istirahat,
    } = this.state.cuti.jumlahHari;

    let saldo = null;
    let isCorrect = null;

    switch (field) {
      case 'lapangan':
        saldo = 24;
        isCorrect = +lapangan <= saldo && +lapangan >= 0;
        return !isCorrect;
      case 'tahunan':
        saldo = this.state.cuti.saldo.tahunan;
        isCorrect = +tahunan <= saldo && +tahunan >= 0;
        return !isCorrect;
      // case "seminarTraining":
      //   saldo = null;
      //   isCorrect = null
      //   return !isCorrect;
      case 'besar':
        saldo = this.state.cuti.saldo.besar;
        isCorrect = +besar <= saldo && +besar >= 0;
        return !isCorrect;
      case 'istirahat':
        saldo = 12 + this.state.cuti.saldo.tahunan;
        isCorrect = +istirahat <= saldo && +istirahat >= 0;
        return !isCorrect;
      default:
        break;
    }
  };

  getJumlahHariCuti = () => {
    const {
      lapangan,
      tahunan,
      seminarTraining,
      besar,
      istirahat,
    } = this.state.cuti.jumlahHari;
    return +lapangan + +tahunan + +seminarTraining + +besar + +istirahat;
  };

  getTanggalBawa = () => {
    let tanggal = new Date(this.state.membawaKeluarga.tglAwal);
    // console.warn(typeof tanggal);
    return `${tanggal.getFullYear()}-${tanggal.getMonth() + 1 < 10 ? '0' : ''}${
      tanggal.getMonth() + 1
    }-${tanggal.getDate() < 10 ? '0' : ''}${tanggal.getDate()}`;
  };

  getTanggal = () => {
    let tanggal = new Date(this.state.awalCuti);
    return `${tanggal.getFullYear()}-${tanggal.getMonth() + 1 < 10 ? '0' : ''}${
      tanggal.getMonth() + 1
    }-${tanggal.getDate() < 10 ? '0' : ''}${tanggal.getDate()}`;
  };
  getTanggalAkhirCuti = () => {
    let tanggal = new Date(this.state.awalCuti);
    tanggal.setDate(tanggal.getDate() + this.getJumlahHariCuti() - 1);
    return `${tanggal.getFullYear()}-${tanggal.getMonth() + 1 < 10 ? '0' : ''}${
      tanggal.getMonth() + 1
    }-${tanggal.getDate() < 10 ? '0' : ''}${tanggal.getDate()}`;
  };

  handleKirim = () => {
    if (
      !this.state.email ||
      this.state.membawaKeluarga.isMembawa == null ||
      !this.state.awalCuti
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
    } else if (
      this.validateJumlahHariCuti('lapangan') ||
      this.validateJumlahHariCuti('tahunan') ||
      this.validateJumlahHariCuti('besar') ||
      this.validateJumlahHariCuti('istirahat') ||
      this.getJumlahHariCuti() <= 0
    ) {
      Alert.alert(
        'Oops!',
        'Pengajuan hari salah.',
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

      Axios.post('/cuti', {
        nrp: this.context.userData.nrp,
        bawa_keluarga: this.state.membawaKeluarga.isMembawa ? '1' : '0',
        tgl_bawa_keluarga: this.state.membawaKeluarga.isMembawa
          ? this.state.membawaKeluarga.tglAwal
          : '',
        c_lapangan: this.state.cuti.jumlahHari.lapangan,
        c_tahunan: this.state.cuti.jumlahHari.tahunan,
        c_seminar: this.state.cuti.jumlahHari.seminarTraining,
        c_besar: this.state.cuti.jumlahHari.besar,
        c_istirahat: this.state.cuti.jumlahHari.istirahat,
        // berangkat: this.state.cuti.tglAwal,
        berangkat: this.getTanggal(this.state.awalCuti),
        kembali: this.getTanggalAkhirCuti(),
        email: this.state.email,
        appr_group: this.state.appr_group,
        marital: this.state.statusPerkawinan,
      })
        .then((response) => {
          this.context.setLoading(false);

          Alert.alert(
            'Success',
            'Pengajuan cuti berhasil dikirim',
            [
              {
                text: 'OK',
                onPress: () => this.goBack(),
              },
            ],
            {onDismiss: () => this.goBack()},
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
          <Appbar.BackAction onPress={() => this.goBack()} />
          <Appbar.Content title="Formulir Pengajuan Cuti" />
        </Appbar.Header>

        <View style={{flex: 1}}>
          {this.state.loading ? (
            <LoadingIndicator />
          ) : this.state.requestError ? (
            <ErrorData onRetry={this.getLeavingData} />
          ) : (
            <ScrollView style={{flex: 1}}>
              <View style={{marginHorizontal: 13, marginTop: 10}}>
                <View pointerEvents="none">
                  <TextInput
                    mode="contained"
                    style={{marginBottom: 5, backgroundColor: 'transparent'}}
                    label="Nama"
                    value={this.state.nama}
                  />
                  <TextInput
                    mode="contained"
                    style={{marginBottom: 5, backgroundColor: 'transparent'}}
                    label="Position"
                    value={this.state.posisi}
                    onChangeText={(text) => this.setState({posisi: text})}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: 50, alignContent: 'center'}}>
                      <TextInput
                        mode="contained"
                        style={{
                          marginBottom: 5,
                          backgroundColor: 'transparent',
                        }}
                        label="MS"
                        value={this.state.statusPerkawinan}
                      />
                    </View>
                    <TextInput
                      mode="contained"
                      style={{
                        marginBottom: 5,
                        backgroundColor: 'transparent',
                        marginHorizontal: 10,
                      }}
                      label="Join Date"
                      value={this.state.tglBergabung}
                      onChangeText={(text) =>
                        this.setState({tglBergabung: text})
                      }
                    />
                    <View style={{flex: 1}}>
                      <TextInput
                        mode="contained"
                        style={{
                          marginBottom: 5,
                          backgroundColor: 'transparent',
                        }}
                        label="POH"
                        value={this.state.penerimaan}
                        onChangeText={(text) =>
                          this.setState({penerimaan: text})
                        }
                      />
                    </View>
                  </View>
                  <TextInput
                    mode="contained"
                    style={{marginBottom: 5, backgroundColor: 'transparent'}}
                    multiline={true}
                    label="Home Address"
                    value={this.state.alamat}
                    onChangeText={(text) => this.setState({alamat: text})}
                  />
                </View>
                <View
                  style={{
                    height: 50,
                    borderRadius: 10,
                    borderColor: Colors.grey400,
                    borderWidth: 0,
                    marginBottom: 20,
                    backgroundColor: 'transparent',
                  }}>
                  <TextInput
                    selectionColor="red"
                    mode="contained"
                    style={{
                      marginBottom: 20,
                      height: 50,
                      backgroundColor: 'transparent',
                    }}
                    label="Email"
                    placeholder="Isi dengan alamat email yang valid"
                    value={this.state.email}
                    keyboardType="email-address"
                    onChangeText={(text) => this.setState({email: text})}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TouchableNativeFeedback
                    onPress={() => {
                      this.setState({
                        membawaKeluarga: {
                          ...this.state.membawaKeluarga,
                          isMembawa: true,
                        },
                      });
                    }}>
                    <View
                      style={{
                        width: 200,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                        borderWidth: 0.5,
                        borderColor: Colors.grey400,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: this.state.membawaKeluarga
                          .isMembawa
                          ? 0
                          : 10,
                        backgroundColor: this.state.membawaKeluarga.isMembawa
                          ? Colors.orange500
                          : Colors.white,
                      }}>
                      <Text
                        style={[
                          {fontSize: 13, textAlign: 'center', height: 20},
                          this.state.membawaKeluarga.isMembawa && {
                            color: Colors.white,
                          },
                        ]}>
                        Membawa Keluarga
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback
                    onPress={() =>
                      this.setState({
                        membawaKeluarga: {
                          isMembawa: false,
                          tglAwal: '',
                        },
                      })
                    }>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                        borderWidth: 0.5,
                        borderColor: Colors.grey400,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: this.state.membawaKeluarga
                          .isMembawa
                          ? 0
                          : 10,
                        borderLeftWidth: 0,
                        backgroundColor:
                          this.state.membawaKeluarga.isMembawa == false
                            ? Colors.orange500
                            : Colors.white,
                      }}>
                      <Text
                        style={[
                          {fontSize: 15, textAlign: 'center'},
                          this.state.membawaKeluarga.isMembawa == false && {
                            color: Colors.white,
                          },
                        ]}>
                        Tidak Membawa Keluarga
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
                {this.state.membawaKeluarga.isMembawa && (
                  <View
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      borderTopWidth: 0,
                      borderColor: Colors.grey800,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      // alignItems: "center",
                    }}>
                    <Text>Tanggal awal membawa keluarga:</Text>
                    <View style={{flexDirection: 'row'}}>
                      <Button
                        onPress={this.showTglBawaKlg}
                        mode="contained"
                        color={Colors.transparent}
                        style={styles.timewrapper}
                        loading={false}>
                        {!this.state.membawaKeluarga.tglAwal
                          ? ''
                          : this.getTanggalBawa()}
                      </Button>
                      <DateTimePickerModal
                        isVisible={this.state.isTglBawaKlgVisible}
                        mode="date"
                        onConfirm={this.tglBawaKlgConfirm}
                        onCancel={this.hideTglBawaKlg}
                      />
                    </View>
                  </View>
                )}

                <Divider style={{marginTop: 17, height: 1}} />

                <View style={{marginLeft: 5}}>
                  <Text style={{marginTop: 15}}>Tanggal awal cuti</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Button
                      onPress={this.showTglAwalCuti}
                      mode="contained"
                      color={Colors.transparent}
                      style={styles.timewrapper}
                      loading={false}>
                      {this.getTanggal()}
                    </Button>
                    <DateTimePickerModal
                      isVisible={this.state.isTglAwalCutiVisible}
                      mode="date"
                      onConfirm={this.tglAwalCutiConfirm}
                      onCancel={this.hideTglAwalCuti}
                    />
                  </View>
                </View>

                <Divider style={{marginTop: 17, height: 1}} />

                <Subheading style={{marginTop: 15, marginBottom: 10}}>
                  Pengajuan jumlah hari cuti
                </Subheading>

                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 110}}>
                    <TextInput
                      selectionColor="red"
                      error={this.validateJumlahHariCuti('lapangan')}
                      mode="outlined"
                      keyboardType="decimal-pad"
                      label="Lapangan"
                      value={this.state.cuti.jumlahHari.lapangan}
                      onChangeText={(text) =>
                        this.setState({
                          cuti: {
                            ...this.state.cuti,
                            jumlahHari: {
                              ...this.state.cuti.jumlahHari,
                              lapangan: text,
                            },
                          },
                        })
                      }
                    />
                    <HelperText
                      type="error"
                      visible={this.validateJumlahHariCuti('lapangan')}>
                      Tidak valid!
                    </HelperText>
                  </View>
                  <View style={{width: 110, marginLeft: 10}}>
                    <TextInput
                      selectionColor="red"
                      error={this.validateJumlahHariCuti('tahunan')}
                      mode="outlined"
                      keyboardType="numeric"
                      label="Tahunan"
                      value={this.state.cuti.jumlahHari.tahunan}
                      onChangeText={(text) =>
                        this.setState({
                          cuti: {
                            ...this.state.cuti,
                            jumlahHari: {
                              ...this.state.cuti.jumlahHari,
                              tahunan: text,
                            },
                          },
                        })
                      }
                    />
                    <HelperText
                      type="error"
                      visible={this.validateJumlahHariCuti('tahunan')}>
                      Tidak valid!
                    </HelperText>
                  </View>
                  <View style={{width: 110, marginLeft: 10}}>
                    <TextInput
                      selectionColor="red"
                      error={this.validateJumlahHariCuti('besar')}
                      mode="outlined"
                      keyboardType="number-pad"
                      label="Besar"
                      value={this.state.cuti.jumlahHari.besar}
                      onChangeText={(text) =>
                        this.setState({
                          cuti: {
                            ...this.state.cuti,
                            jumlahHari: {
                              ...this.state.cuti.jumlahHari,
                              besar: text,
                            },
                          },
                        })
                      }
                    />
                    <HelperText
                      type="error"
                      visible={this.validateJumlahHariCuti('besar')}>
                      Tidak valid!
                    </HelperText>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 110}}>
                    <TextInput
                      selectionColor="red"
                      mode="outlined"
                      keyboardType="number-pad"
                      label="Training"
                      value={this.state.cuti.jumlahHari.seminarTraining}
                      onChangeText={(text) =>
                        this.setState({
                          cuti: {
                            ...this.state.cuti,
                            jumlahHari: {
                              ...this.state.cuti.jumlahHari,
                              seminarTraining: text,
                            },
                          },
                        })
                      }
                    />
                    <HelperText type="error" visible={false}>
                      Tidak valid!
                    </HelperText>
                  </View>
                  <View style={{width: 110, marginLeft: 10}}>
                    <TextInput
                      selectionColor="red"
                      error={this.validateJumlahHariCuti('istirahat')}
                      mode="outlined"
                      keyboardType="number-pad"
                      label="Istirahat"
                      value={this.state.cuti.jumlahHari.istirahat}
                      onChangeText={(text) =>
                        this.setState({
                          cuti: {
                            ...this.state.cuti,
                            jumlahHari: {
                              ...this.state.cuti.jumlahHari,
                              istirahat: text,
                            },
                          },
                        })
                      }
                    />
                    <HelperText
                      type="error"
                      visible={this.validateJumlahHariCuti('istirahat')}>
                      Tidak valid!
                    </HelperText>
                  </View>
                </View>
              </View>

              {!!this.state.awalCuti && (
                <>
                  <View
                    style={{
                      backgroundColor: Colors.grey300,
                      height: 1,
                      marginTop: 10,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Colors.grey200,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        alignItems: 'center',
                        justifyContent: 'space-around',
                      }}>
                      <Text style={styles.teks}>MULAI CUTI </Text>
                      {/* <Text style={styles.timewrapper}>
                        {this.getTanggal(this.state.awalCuti)}
                      </Text> */}
                      <Button
                        onPress={null}
                        mode="contained"
                        color={Colors.transparent}
                        style={styles.haricuti}
                        loading={false}>
                        {this.getTanggal(this.state.awalCuti)}
                      </Button>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        alignItems: 'center',
                        justifyContent: 'space-around',
                      }}>
                      <Text style={styles.teks}>AKHIR CUTI </Text>
                      <Button
                        onPress={null}
                        mode="contained"
                        color={Colors.transparent}
                        style={styles.haricuti}
                        loading={false}>
                        {this.getTanggalAkhirCuti()}
                      </Button>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        alignItems: 'center',
                        justifyContent: 'space-around',
                      }}>
                      <Text style={styles.teks}>TOTAL HARI</Text>
                      <Button
                        onPress={null}
                        mode="contained"
                        color={Colors.transparent}
                        style={styles.haricuti}
                        loading={false}>
                        {`${this.getJumlahHariCuti()} Hari`}{' '}
                      </Button>
                    </View>
                  </View>
                </>
              )}
              <Divider style={{marginBottom: 20}} />
              <TouchableNativeFeedback
                onPress={
                  () => this.handleKirim()
                  // props.onSendPreUseCheck(
                  //   finalRemarkText,
                  //   oprStatusObj.code,
                  //   hazardObj.code,
                  //   glObj.nrp
                  // )
                }>
                <View
                  style={{
                    height: 50,
                    backgroundColor: Colors.orange700,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 25,
                    width: 300,
                    alignSelf: 'center',
                  }}>
                  <Title style={{color: Colors.white}}>Kirim</Title>
                </View>
              </TouchableNativeFeedback>
              <View style={{height: 400}} />
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
      </>
    );
  }
}

const styles = {
  timewrapper: {
    width: 200,
    elevation: 0,
    marginTop: 2,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: 'orange',
    alignSelf: 'center',
    color: 'blue',
    fontSize: 18,
  },
  haricuti: {
    width: 160,
    elevation: 0,
    marginTop: 0,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: 'transparent',
    alignSelf: 'flex-end',
    color: 'white',
    fontSize: 18,
  },
  teks: {
    fontSize: 16,
    marginRight: 20,
  },
};

LeavingEntryScreen.contextType = AppContext;

export default LeavingEntryScreen;
