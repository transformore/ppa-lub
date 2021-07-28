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
  DefaultTheme,
  Caption,
} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import Axios from 'axios';
import LinearGradient from 'react-native-linear-gradient'; // import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  LoadingIndicator,
  ErrorData,
  InputOption,
  AutoResizeCard,
  Volume,
} from '../components';
import {FlatList} from 'react-native-gesture-handler';
import {colors} from '../styles';
import {AppContext} from '../context';
import Modal from 'react-native-modal';
import {AppExt} from '../utils';
import ImagePicker from 'react-native-image-crop-picker';
import FeatherIcons from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
const {width, height} = Dimensions.get('screen');
const h_margin = 15;

export class LubScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      refreshing: false,
      requestError: false,
      keyboardState: 'closed',
      storageId: null, //code_number,type
      unitId: null, // code_number
      locationId: null, //id,nama
      typeId: null, // id_oil_grease,jenis,uom
      componentId: null, //id_component , component
      statusId: null, //value , text
      storageOptions: null, //code_number,type
      unitOptions: null, // code_number
      locationOptions: null, //id,nama
      typeOptions: null, // id_oil_grease,jenis,uom
      componentOptions: null, //id_component , component
      statusOptions: null, //value , text

      selectedCard: null,
      volume: null,
      hm: null,
      lastHm: null,
      uom: null,
      isHistoryDialogVisible: false,
      listLub: [],
    };
  }

  resetState = () => {
    this.setState({
      loading: false,
      refreshing: false,
      requestError: false,
      keyboardState: 'closed',
      storageId: null,
      // unitId: null,
      locationId: null,
      typeId: null,
      componentId: null,
      statusId: null,
      storageOptions: null,
      // unitOptions: null,
      locationOptions: null,
      typeOptions: null,
      componentOptions: null,
      statusOptions: null,

      selectedCard: null,
      volume: null,
      // hm: null,
      uom: null,
    });
  };
  setUnit = (unit) => {
    this.setState({unitId: unit});
    this.setState({hm: null});
  };
  goBack = () => {
    // this.props.route.params.goLubHistory();
    // this.props.navigation.goBack();
    this.resetState();
    this.getLubHistory();
    this.getLubData();
  };
  hideHistoryDialog = () => {
    this.setState({isHistoryDialogVisible: false});
  };
  showHistoryDialog = () => {
    this.setState({isHistoryDialogVisible: true});
  };
  showSendConfirm = () => {
    Alert.alert(
      'Confirmation',
      `Apakah pengisian sudah benar ?      CN:${
        this.state.unitOptions[this.state.unitId].code
      }  HM:${this.state.hm}  Volume:${this.state.volume} ${
        this.state.typeOptions[this.state.typeId].uom
      }`,
      [
        {text: 'Confirm', onPress: () => this.handleKirim()},
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  componentDidMount() {
    this.getLubData();
    this.getLubHistory();
  }
  _selectCard = (id) => {
    this.context.setSelectedCard(id);
  };
  _setVolume = (val) => this.setState({volume: val});

  getLubData = () => {
    // this.setState({loading: true});
    Axios.get(`/oilgreaseForm/${this.context.userData.nrp}`)
      .then((res) => {
        const formattedStorage = res.data.storage.map((item, index) => ({
          id: index,
          code: item.type,
          name: item.code_number,
        }));
        const formattedLocation = res.data.location.map((item, index) => ({
          id: index,
          code: item.id,
          name: item.nama,
        }));
        const formattedUnit = res.data.unit.map((item, index) => ({
          id: index,
          code: item.code_number,
          name: item.code_number,
        }));
        const formattedType = res.data.type.map((item, index) => ({
          id: index,
          code: item.id_oil_grease,
          name: item.jenis,
          uom: item.uom,
        }));
        const formattedComponent = res.data.component.map((item, index) => ({
          id: index,
          code: item.id_component,
          name: item.component,
        }));
        const formattedStatus = res.data.status.map((item, index) => ({
          id: index,
          code: item.value,
          name: item.text,
        }));
        this.setState({
          loading: false,
          refreshing: false,
          requestError: false,
          storageOptions: formattedStorage,
          locationOptions: formattedLocation,
          unitOptions: formattedUnit,
          typeOptions: formattedType,
          componentOptions: formattedComponent,
          statusOptions: formattedStatus,
        });
        // alert(JSON.stringify(this.state.storageOptions));
        // alert(JSON.stringify(this.state.locationOptions));
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
  getLubHistory = () => {
    this.setState({
      isLoading: true,
    });
    Axios.get(`/oilgreaseHistorical/${this.context.userData.nrp}`)
      .then((res) => {
        this.setState({
          isLoading: false,
          isRequestError: false,
          listLub: res.data.data,
        });
      })
      .catch((error) => {
        alert(error);
        this.setState({
          isLoading: false,
          isRequestError: true,
        });
      });
  };
  getLastHm = () => {
    // alert(this.state.unitOptions[this.state.unitId].code);
    this.setState({
      isLoading: true,
    });
    Axios.get(`/lastHm?cn=${this.state.unitOptions[this.state.unitId].code}`)
      .then((res) => {
        this.setState({
          isLoading: false,
          isRequestError: false,
          hm: res.data.last_hm,
          lastHm: res.data.last_hm,
        });
        alert(this.state.hm);
      })
      .catch((error) => {
        alert(error);
        this.setState({
          isLoading: false,
          isRequestError: true,
        });
      });
  };
  handleKirim = () => {
    if (
      this.state.volume == null ||
      this.state.hm == null ||
      // this.state.storageId == null ||
      this.state.unitId == null ||
      this.state.locationId == null ||
      this.state.typeId == null ||
      this.state.componentId == null ||
      this.state.statusId == null ||
      this.state.hm < this.state.lastHm ||
      this.state.hm - this.state.lastHm > 10
    ) {
      Alert.alert(
        'Oops!',
        'Input tidak lengkap /invalid HM !',
        [
          {
            text: 'OK',
            onPress: () => null,
          },
        ],
        {onDismiss: () => null},
      );
    } else {
      this.setState({loading: true});
      Axios.post('/oilgreaseFinish', {
        nrp: this.context.userData.nrp,
        hm: this.state.hm,
        qty: this.state.volume,
        // storage: this.state.storageOptions[this.state.storageId].name,
        storage: this.context.oilGreaseStorage,
        unit: this.state.unitOptions[this.state.unitId].code,
        loc: this.state.locationOptions[this.state.locationId].code,
        type: this.state.typeOptions[this.state.typeId].code,
        component: this.state.componentOptions[this.state.componentId].code,
        status: this.state.statusOptions[this.state.statusId].code,
      })
        .then((response) => {
          this.setState({loading: false});
          Alert.alert(
            'Success',
            `${response.data.message}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  this.goBack();
                },
              },
            ],
            {
              onDismiss: () => {
                this.goBack();
              },
            },
          );
        })
        .catch((error) => {
          this.context.setLoading(false);
          Alert.alert(
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
          // backgroundColor={'#192a56'}
          backgroundColor={'rgba(5,10,25,0.9)'}
          translucent={false}
        />

        {/* <Appbar.Header style={{zIndex: 3}}>
          <Appbar.BackAction onPress={this.goBack} />
          <Appbar.Content title="Grease Oil Transaction" />
        </Appbar.Header> */}
        <LinearGradient
          colors={['rgba(5,10,25,0.9)', '#3b5998', '#192f6a']}
          style={styles.linearGradient}>
          <View
            style={{
              flex: 1,
              // backgroundColor: 'rgba(5,10,25,0.9)',
              justifyContent: 'center',
            }}>
            {this.state.loading ? (
              <LoadingIndicator />
            ) : this.state.requestError ? (
              <ErrorData onRetry={this.getLubData} />
            ) : (
              <ScrollView style={{flex: 1}}>
                <View
                  style={{
                    paddingHorizontal: 13,
                  }}>
                  <View
                    style={{
                      borderColor: colors.grey,
                      width: width - 2 * h_margin,
                      alignItems: 'center',
                      alignSelf: 'center',
                      marginBottom: 25,
                    }}>
                    <View>
                      <Text style={styles.screenHeader}>
                        OIl GREASE TRANSACTION
                      </Text>
                    </View>
                    <View style={styles.userTextborder}>
                      <Text style={styles.userContent}>
                        {this.context.userData.nama}
                      </Text>
                    </View>
                    <View style={styles.userTextborder}>
                      <Text style={styles.jabatanContent}>
                        {this.context.userData.posisi}
                      </Text>
                    </View>
                    <View style={styles.userTextborder}>
                      <Text style={styles.storageContent}>
                        {this.context.oilGreaseStorage}
                      </Text>
                    </View>
                  </View>
                  <View style={{height: 10}} />
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center',
                      alignSelf: 'center',
                      justifyContent: 'space-between',
                      width: width - 2 * h_margin,
                    }}>
                    <InputOption
                      label="UNIT C/N  >>"
                      color="white"
                      value={
                        this.state.unitId != null &&
                        this.state.unitOptions[this.state.unitId].name
                      }
                      optionData={this.state.unitOptions}
                      useIndexReturn={true}
                      onOptionChoose={(val) => this.setUnit(val)}
                      hasHelper={false}
                      style={
                        this.state.unitId == null
                          ? styles.unitBorder
                          : styles.unitDisableBorder
                      }
                      isSearchable={true}
                    />
                    {this.state.hm == null ? (
                      <View style={styles.hmBorder}>
                        <TouchableOpacity
                          onPress={() => {
                            this.state.unitId != null ? this.getLastHm() : null;
                          }}>
                          <Text style={styles.hmLabelInactive}>HM >></Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.hmDisableBorder}>
                        <Text style={styles.hmLabelActive}>HM</Text>
                        <TextInput
                          disabled={this.state.hm == null}
                          mode="cotained"
                          style={{
                            color: colors.white,
                            fontSize: 18,
                            fontWeight: 'bold',
                          }}
                          label="HM"
                          placeholder=""
                          value={this.state.hm}
                          keyboardType="numeric"
                          onChangeText={(text) => this.setState({hm: text})}
                        />
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      width: width - 3 * h_margin,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <InputOption
                      label="JENIS PELUMAS"
                      value={
                        this.state.typeId != null &&
                        this.state.typeOptions[this.state.typeId].name
                      }
                      optionData={this.state.typeOptions}
                      useIndexReturn={true}
                      onOptionChoose={(val) => this.setState({typeId: val})}
                      hasHelper={false}
                      style={
                        this.state.typeId == null
                          ? styles.optiontextborder
                          : styles.lubDisableBorder
                      }
                      isSearchable={true}
                    />
                  </View>
                  {this.state.typeId !== null ? (
                    <View>
                      <AutoResizeCard
                        selected={this.context.selectedCard}
                        id={3}
                        onPress={() => this._selectCard(3)}
                        icon={'opacity'}
                        idleVal={this.state.volume}
                        idleTitle={
                          this.state.typeOptions[this.state.typeId].uom
                        }
                        // idleTitle={'Volume'}
                        color={colors.yellow}>
                        <Volume
                          val={this.state.volume}
                          onSet={this._setVolume}
                          uom={this.state.typeOptions[this.state.typeId].uom}
                          ref="volumeRef"
                          {...this.props}
                        />
                      </AutoResizeCard>
                      {this.state.selectedCard == null ||
                      this.state.selectedCard == 5 ? (
                        <View style={{height: 0}} />
                      ) : (
                        <Button
                          loading={this.state.loading}
                          dark
                          // color={colors.primary}
                          mode="contained"
                          onPress={() => this._selectCard(5)}
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
                          Enter
                        </Button>
                      )}
                    </View>
                  ) : (
                    <View style={{height: 0}} />
                  )}
                  <InputOption
                    label="LOCATION"
                    value={
                      this.state.locationId != null &&
                      this.state.locationOptions[this.state.locationId].name
                    }
                    optionData={this.state.locationOptions}
                    useIndexReturn={true}
                    onOptionChoose={(val) => this.setState({locationId: val})}
                    hasHelper={false}
                    style={
                      this.state.locationId == null
                        ? styles.optiontextborder
                        : styles.disableBorder
                    }
                    isSearchable={true}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center',
                      alignSelf: 'center',
                      width: width - 2 * h_margin,
                    }}>
                    <InputOption
                      label="KOMPONEN"
                      value={
                        this.state.componentId != null &&
                        this.state.componentOptions[this.state.componentId].name
                      }
                      optionData={this.state.componentOptions}
                      useIndexReturn={true}
                      onOptionChoose={(val) =>
                        this.setState({componentId: val})
                      }
                      hasHelper={false}
                      style={
                        this.state.componentId == null
                          ? styles.unitBorder
                          : styles.unitDisableBorder
                      }
                      isSearchable={true}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignSelf: 'flex-start',
                        justifyContent: 'flex-start',
                        marginRight: 25,
                      }}>
                      <InputOption
                        label="STATUS"
                        value={
                          this.state.statusId != null &&
                          this.state.statusOptions[this.state.statusId].name
                        }
                        optionData={this.state.statusOptions}
                        useIndexReturn={true}
                        onOptionChoose={(val) => this.setState({statusId: val})}
                        hasHelper={false}
                        style={
                          this.state.statusId == null
                            ? styles.hmBorder
                            : styles.hmDisableBorder
                        }
                        isSearchable={true}
                      />
                    </View>
                  </View>
                </View>
                {this.state.volume != null &&
                this.state.hm != null &&
                // this.state.storageId != null &&
                this.state.unitId != null &&
                this.state.locationId != null &&
                this.state.typeId != null &&
                this.state.componentId != null &&
                this.state.statusId != null ? (
                  <View style={{alignSelf: 'center'}}>
                    <TouchableNativeFeedback
                      onPress={() => this.showSendConfirm()}>
                      <View
                        style={{
                          marginTop: 35,
                          width: width - 2 * h_margin,
                          height: 50,
                          backgroundColor: colors.ss6orange,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 25,
                        }}>
                        <Title style={{color: Colors.white}}>
                          Simpan dan Kirim
                        </Title>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                ) : this.state.listLub.length > 0 ? (
                  <View
                    style={{
                      flex: 1,
                      marginHorizontal: 15,
                      borderWidth: 0.8,
                      borderColor: colors.grey,
                      marginTop: 15,
                      borderRadius: 10,
                      width: width - 2 * h_margin,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      paddingBottom: 5,
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        height: 35,
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          marginVertical: 5,
                          height: 25,
                          color: 'white',
                        }}>
                        HISTORY
                      </Text>
                    </View>
                    <View
                      style={{
                        width: width - 2 * h_margin,
                        backgroundColor: colors.blue,
                        height: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: 'center',
                          color: colors.white,
                          width: 60,
                        }}>
                        Tanggal
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: 'center',
                          color: colors.white,
                          width: 30,
                        }}>
                        Unit
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: 'center',
                          color: colors.white,
                          width: 80,
                        }}>
                        HM
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: 'center',
                          color: colors.white,
                          width: 40,
                        }}>
                        Qty
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: 'left',
                          color: colors.white,
                          width: 185,
                        }}>
                        Jenis Pelumas
                      </Text>
                    </View>
                    {this.state.isLoading ? (
                      <LoadingIndicator />
                    ) : this.state.isRequestError ? (
                      <ErrorData onRetry={this.getLub} />
                    ) : !this.state.listLub ? (
                      <>
                        {/* <View style={{height: 30}} /> */}
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'transparent',
                          }}>
                          <Icons
                            style={{margin: 10}}
                            name="history"
                            size={75}
                            color={Colors.grey400}
                          />
                          <Caption>No Data</Caption>
                        </View>
                      </>
                    ) : (
                      <FlatList
                        data={this.state.listLub}
                        renderItem={({item}) => {
                          const monthName = [
                            '/01',
                            '/02',
                            '/03',
                            '/04',
                            '/05',
                            '/06',
                            '/07',
                            '/08',
                            '/09',
                            '/10',
                            '/11',
                            '/12',
                          ];

                          const date = new Date(item.tanggal);
                          const formattedDate = `${
                            date.getDate() < 10 ? '0' : ''
                          }${date.getDate()}${monthName[date.getMonth()]}`;
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                backgroundColor: colors.opaWhite,
                              }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  paddingLeft: 15,
                                  alignSelf: 'center',
                                  paddingVertical: 5,
                                  color: 'white',
                                  width: 60,
                                }}>
                                {formattedDate || '-'}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  paddingHorizontal: 0,
                                  paddingVertical: 5,
                                  alignSelf: 'center',
                                  textAlign: 'left',
                                  color: colors.yello,
                                  width: 40,
                                }}>
                                {item.unit || '-'}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  paddingLeft: 7,
                                  paddingVertical: 5,
                                  alignSelf: 'center',
                                  textAlign: 'right',
                                  color: 'white',
                                  width: 60,
                                }}>
                                {item.hm || '-'}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  paddingLeft: 7,
                                  paddingVertical: 5,
                                  alignSelf: 'center',
                                  textAlign: 'right',
                                  color: colors.red,
                                  width: 40,
                                }}>
                                {parseFloat(item.qty).toFixed(1) || '-'}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 10,
                                  paddingLeft: 10,
                                  paddingVertical: 5,
                                  alignSelf: 'center',
                                  textAlign: 'left',
                                  color: 'white',
                                  width: 175,
                                }}>
                                {item.jenis_oilgrease || '-'}
                              </Text>
                            </View>
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={Divider}
                        contentContainerStyle={{padding: 0}}
                      />
                    )}
                  </View>
                ) : (
                  <View style={{height: 0}} />
                )}
                <View style={{height: 10}} />
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('LubHistory');
                  }}>
                  {/* <View> */}
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 18,
                      marginTop: 15,
                      color: colors.blue,
                    }}>
                    Back
                  </Text>
                  {/* </View> */}
                </TouchableOpacity>
                <Divider style={{height: 1.5}} />
              </ScrollView>
            )}
          </View>
        </LinearGradient>
        <Modal
          isVisible={this.state.loading}
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
  optiontextborder: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
    paddingHorizontal: 15,
    borderColor: colors.opaWhite,
    backgroundColor: colors.opaWhite,
    borderWidth: 3,
    borderRadius: width / 16,
    width: width - 2 * h_margin,
    height: 50,
    marginVertical: 5,
    elevation: 3,
  },
  unitBorder: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderColor: colors.opaWhite,
    backgroundColor: colors.opaWhite,
    borderWidth: 3,
    borderRadius: width / 16,
    width: 150,
    height: 50,
    marginVertical: 5,
    elevation: 3,
  },
  disableBorder: {
    alignSelf: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: 15,
    paddingTop: 5,
    borderColor: colors.silverGrey,
    // backgroundColor: colors.elusiveblue,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width - 2 * h_margin,
    height: 50,
    marginVertical: 5,
    elevation: 3,
  },
  unitDisableBorder: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingTop: 5,
    borderColor: colors.grey,
    // backgroundColor: colors.elusiveblue,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: 150,
    height: 50,
    marginVertical: 5,
    elevation: 3,
  },
  hmBorder: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderColor: colors.opaWhite,
    backgroundColor: colors.opaWhite,
    borderWidth: 3,
    borderRadius: width / 16,
    width: 215,
    height: 50,
    marginVertical: 5,
    elevation: 3,
  },
  hmDisableBorder: {
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 25,
    paddingTop: 5,
    borderColor: colors.grey,
    // backgroundColor: colors.disableWhite,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: 215,
    height: 50,
    marginVertical: 5,
    elevation: 3,
  },
  userTextborder: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 2 * h_margin,
    height: 25,
  },
  userLabel: {width: 90, fontSize: 18},
  userContent: {
    width: width - 2 * h_margin,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  unitContent: {
    width: width - 2 * h_margin,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  jabatanContent: {
    width: width - 2 * h_margin,
    fontSize: 12,
    color: colors.yellow,
    textAlign: 'center',
  },
  screenHeader: {
    width: width - 2 * h_margin,
    fontSize: 25,
    color: colors.blue,
    textAlign: 'center',
    marginBottom: 20,
  },
  storageContent: {
    width: width - 2 * h_margin,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.ss6orange,
    textAlign: 'center',
  },
  lubDisableBorder: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingTop: 5,
    borderColor: colors.silverGrey,
    // backgroundColor: colors.elusiveblue,
    borderWidth: 0,
    borderRadius: width / 16,
    width: width - 2 * h_margin,
    flex: 1,
    marginVertical: 2,
    elevation: 3,
    height: 70,
  },
  labelInactive: {
    color: DefaultTheme.colors.placeholder,
    fontSize: 16,
    marginHorizontal: 5,
    width: 115,
    textAlign: 'left',
    marginLeft: 15,
  },
  labelActive: {
    color: DefaultTheme.colors.placeholder,
    fontSize: 10,
    marginLeft: 15,
    width: 65,
  },
  hmLabelActive: {
    // color: DefaultTheme.colors.placeholder,
    color: colors.white,
    fontSize: 10,
    marginLeft: 0,
    width: 20,
    alignSelf: 'flex-start',
  },
  hmLabelInactive: {
    color: 'white',
    fontSize: 16,
    width: 210,
    alignSelf: 'center',
    textAlign: 'center',
  },
  hmInactive: {
    color: DefaultTheme.colors.placeholder,
    fontSize: 16,
    marginHorizontal: 5,
    width: 50,
    textAlign: 'left',
    marginLeft: 15,
  },
  headerText: {
    fontSize: 9,
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
};

LubScreen.contextType = AppContext;
export default LubScreen;
