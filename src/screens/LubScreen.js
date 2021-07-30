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
  FillForm,
  AutoResizeCard,
  Volume,
} from '../components';
// import {AppExt} from '../utils';
// import ImagePicker from 'react-native-image-crop-picker';
// import FeatherIcons from 'react-native-vector-icons/Feather';
// import RBSheet from 'react-native-raw-bottom-sheet';
import {FlatList} from 'react-native-gesture-handler';
import {colors} from '../styles';
import {AppContext} from '../context';
import Modal from 'react-native-modal';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
const {width, height} = Dimensions.get('screen');
const h_margin = 15;
const lubeType = <Icons name="oil" size={25} color="#900" />;
const komponen = <FontAwesome name="gears" size={20} color="#EE5A24" />;
const unitCn = <Icons name="tractor" size={25} color={colors.deeppurple} />;
const hmUnit = <AntDesign name="hourglass" size={20} color="#EE5A24" />;
const status = <Icons name="tools" size={20} color={colors.lightblue} />;
const lokasi = (
  <SimpleLineIcons name="location-pin" size={20} color="#EE5A24" />
);

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
          backgroundColor={'#192a56'}
          translucent={false}
        />
        <LinearGradient
          // colors={['rgba(5,10,25,0.9)', '#3b5998', '#192f6a']}
          // colors={['rgba(5,10,25,0.9)', 'white', '#293B5F']}
          colors={[
            '#192a56',
            colors.opaWhite,
            colors.safeArea,
            colors.safeArea,
            colors.safeArea,
            colors.safeArea,
            colors.blek,
          ]}
          style={styles.linearGradient}>
          <View
            style={{
              // flex: 1,
              height: this.context.selectedCard == 3 ? height : height - 270,
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
                    width: width,
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={{height: 15}} />
                  {this.context.selectedCard == 3 ? (
                    <View style={{height: 0}} />
                  ) : (
                    <View
                      style={{
                        flexDirection: 'column',
                        width: width - 3 * h_margin,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 15,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        height: 130,
                      }}>
                      <View>
                        <Text style={styles.screenHeader}>
                          OIl & GREASE TRANSACTION
                        </Text>
                      </View>
                      <View style={{height: 25}} />
                      <View style={styles.userTextborder}>
                        <AntDesign
                          name="user"
                          size={25}
                          color={colors.darkBlue}
                        />
                        <Text style={styles.userContent}>
                          {this.context.userData.nama}
                        </Text>
                      </View>
                      <View style={styles.userTextborder}>
                        <Text style={styles.jabatanContent}>
                          {this.context.userData.posisi}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={{height: 20}} />
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 30,
                      width: width - 3 * h_margin,
                      paddingVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      // height: 50,
                    }}>
                    <Text style={{fontSize: 18, marginRight: 10}}>
                      {/* <Icons name="tanker-truck" size={25} color="#EE5A24" />{' '} */}
                      STORAGE :
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        color: colors.red,
                        fontWeight: 'bold',
                      }}>
                      {this.context.oilGreaseStorage}
                    </Text>
                  </View>
                  {/* <View style={{height: 20}} /> */}
                  <Divider style={{height: 20}} />
                  <View
                    style={{
                      flexDirection: 'row',
                      // flex: 1,
                      alignItems: 'center',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      width: width - 3 * h_margin,
                    }}>
                    <View>
                      <FillForm
                        topPosition={-13}
                        label="C/N"
                        icon={unitCn}
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
                    </View>
                    <View style={{width: 5}} />
                    {this.state.hm == null ? (
                      <View style={styles.hmBorder}>
                        <TouchableOpacity
                          onPress={() => {
                            this.state.unitId != null ? this.getLastHm() : null;
                          }}>
                          <Text style={styles.hmLabelInactive}>
                            {hmUnit} Hourmeter
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.hmDisableBorder}>
                        <View
                          style={{
                            position: 'absolute',
                            top: -7,
                            paddingHorizontal: 25,
                            left: 20,
                          }}>
                          <Text style={styles.hmLabelActive}>{hmUnit}</Text>
                        </View>
                        <TextInput
                          disabled={this.state.hm == null}
                          mode="cotained"
                          style={{
                            // color: colors.white,
                            color: colors.blue,
                            fontSize: 18,
                            fontWeight: 'bold',
                            height: 50,
                          }}
                          // label="HM"
                          label={hmUnit}
                          placeholder=""
                          value={this.state.hm}
                          keyboardType="numeric"
                          onChangeText={(text) => this.setState({hm: text})}
                        />
                      </View>
                    )}
                  </View>
                  <View style={{height: 6}} />
                  <View
                    style={{
                      width: width - 3 * h_margin,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <FillForm
                      label="Lubrican Type"
                      icon={lubeType}
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
                          : this.state.typeOptions[this.state.typeId].name
                              .length < 30
                          ? styles.lubDisableBorder
                          : styles.lubHugeBorder
                      }
                      isSearchable={true}
                    />
                  </View>
                  <View style={{height: 10}} />
                  {this.state.typeId !== null ? (
                    <View
                      style={{
                        flex: 1,
                        // position: 'absolute',
                        top: -10,
                        zIndex: 3,
                      }}>
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
                    </View>
                  ) : (
                    <View style={{height: 0}} />
                  )}
                  <View style={{height: 6}} />
                  <View
                    style={{
                      width: width - 2 * h_margin,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <View>
                      <FillForm
                        label="Component"
                        icon={komponen}
                        value={
                          this.state.componentId != null &&
                          this.state.componentOptions[this.state.componentId]
                            .name
                        }
                        optionData={this.state.componentOptions}
                        useIndexReturn={true}
                        onOptionChoose={(val) =>
                          this.setState({componentId: val})
                        }
                        hasHelper={false}
                        style={
                          this.state.componentId == null
                            ? styles.komponenBorder
                            : styles.komponenDisableBorder
                        }
                        isSearchable={true}
                      />
                    </View>
                    <View style={{width: 5}} />
                    <View>
                      <FillForm
                        label="Status"
                        icon={status}
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
                            ? styles.statusBorder
                            : // this.state.statusId.length > 22
                              // ?
                              styles.statusDisableBorder
                          // : styles.lubHugeBorder
                        }
                        isSearchable={true}
                      />
                    </View>
                  </View>
                  <View style={{height: 10}} />
                  <FillForm
                    label="Location"
                    icon={lokasi}
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
                        : this.state.locationOptions[this.state.locationId].name
                            .length < 25
                        ? styles.disableBorder
                        : styles.lubHugeBorder
                    }
                    isSearchable={true}
                  />
                </View>
              </ScrollView>
            )}
          </View>
          <ScrollView>
            {this.state.volume != null &&
            this.state.hm != null &&
            // this.state.storageId != null &&
            this.state.unitId != null &&
            this.state.locationId != null &&
            this.state.typeId != null &&
            this.state.componentId != null &&
            this.state.statusId != null ? (
              <View
                style={{alignSelf: 'center', height: height / 4, width: width}}>
                <TouchableNativeFeedback onPress={() => this.showSendConfirm()}>
                  <View
                    style={{
                      marginTop: 35,
                      width: width - 4 * h_margin,
                      height: 45,
                      backgroundColor: colors.ss6orange,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderRadius: 25,
                    }}>
                    <Title style={{color: Colors.white, fontSize: 18}}>
                      Simpan & Kirim
                    </Title>
                  </View>
                </TouchableNativeFeedback>
              </View>
            ) : this.state.listLub.length > 0 ? (
              <View
                style={{
                  flex: 1,
                  borderWidth: 0.8,
                  borderColor: colors.opaWhite,
                  marginTop: 15,
                  borderRadius: 7,
                  width: width,
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
                      color: colors.blek,
                    }}>
                    LUBRICATING HISTORY
                  </Text>
                </View>
                <View
                  style={{
                    width: width,
                    backgroundColor: colors.blue,
                    height: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: 'center',
                      alignSelf: 'center',
                      color: colors.white,
                      width: 70,
                    }}>
                    Date
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: 'center',
                      color: colors.white,
                      width: 35,
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
                      width: 45,
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
                            backgroundColor: colors.lightGrey,
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              paddingLeft: 15,
                              alignSelf: 'center',
                              textAlign: 'center',
                              paddingVertical: 5,
                              color: colors.deepgray,
                              width: 65,
                            }}>
                            {formattedDate || '-'}
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              paddingHorizontal: 0,
                              paddingVertical: 5,
                              alignSelf: 'center',
                              textAlign: 'left',
                              color: colors.darkBlue,
                              width: 50,
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
                              color: colors.ss6orange,
                              width: 55,
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
                              color: colors.darkBlue,
                              width: 50,
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
                              color: colors.blue,
                              width: 140,
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
            <View style={{height: 30}} />
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
                  color: '#341f97',
                }}>
                Back
              </Text>
              {/* </View> */}
            </TouchableOpacity>
          </ScrollView>
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
    paddingHorizontal: 40,
    borderColor: colors.opaWhite,
    backgroundColor: colors.opaWhite,
    borderWidth: 3,
    borderRadius: width / 16,
    width: width / 1.25,
    height: 45,
    marginVertical: 5,
    elevation: 3,
  },
  unitBorder: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderColor: colors.opaWhite,
    backgroundColor: colors.opaWhite,
    // backgroundColor: colors.safeArea,
    borderWidth: 3,
    borderRadius: width / 16,
    width: width / 2.7,
    height: 45,
    marginVertical: 5,
    elevation: 3,
  },
  komponenBorder: {
    alignSelf: 'center',
    alignItems: 'flex-start',
    // flexDirection: 'row',
    paddingHorizontal: 15,
    borderColor: colors.opaWhite,
    backgroundColor: colors.opaWhite,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width / 2.6,
    height: 45,
    marginVertical: 5,
    elevation: 2,
  },
  statusBorder: {
    alignSelf: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 15,
    borderColor: colors.opaWhite,
    backgroundColor: colors.opaWhite,
    // backgroundColor: colors.safeArea,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width / 2.5,
    height: 45,
    marginVertical: 5,
    elevation: 3,
  },
  komponenDisableBorder: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderColor: colors.opaWhite,
    // backgroundColor: colors.opaWhite,
    backgroundColor: colors.safeArea,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width / 2.7,
    height: 45,
    marginVertical: 5,
    elevation: 3,
  },
  statusDisableBorder: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderColor: colors.opaWhite,
    // backgroundColor: colors.opaWhite,
    backgroundColor: colors.safeArea,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width / 2.05,
    height: 45,
    marginVertical: 5,
    elevation: 2,
  },
  disableBorder: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 15,
    paddingTop: 5,
    borderColor: colors.opaWhite,
    backgroundColor: colors.safeArea,
    // backgroundColor: colors.elusiveblue,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width - 4 * h_margin,
    height: 45,
    marginVertical: 5,
    elevation: 2,
  },
  unitDisableBorder: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingTop: 5,
    borderColor: colors.opaWhite,
    backgroundColor: colors.safeArea,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width / 2.7,

    height: 45,
    marginVertical: 5,
    elevation: 2,
  },
  hmBorder: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderColor: colors.opaWhite,
    backgroundColor: colors.opaWhite,
    // backgroundColor: colors.safeArea,
    borderWidth: 3,
    borderRadius: width / 16,
    width: width / 2.5,
    height: 45,
    marginVertical: 5,
    elevation: 3,
  },
  hmDisableBorder: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingTop: 5,
    borderColor: colors.opaWhite,
    backgroundColor: colors.safeArea,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width / 2.1,
    height: 45,
    marginVertical: 5,
    elevation: 3,
  },
  userTextborder: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 3 * h_margin,
    height: 25,
  },
  userLabel: {width: 90, fontSize: 18},
  userContent: {
    width: width - 3 * h_margin,
    fontSize: 18,
    fontWeight: 'bold',
    // color: colors.ss6orange,
    color: colors.darkBlue,
    textAlign: 'center',
  },
  unitContent: {
    width: width - 3 * h_margin,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.blek,
    textAlign: 'center',
  },
  jabatanContent: {
    width: width - 3 * h_margin,
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
  },
  screenHeader: {
    width: width - 8 * h_margin,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    height: 25,
    fontFamily: 'Cookie-Regular',
    // marginBottom: 20,
  },
  storageContent: {
    width: width - 3 * h_margin,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.ss6orange,
    textAlign: 'center',
    // alignSelf: 'flex-end',
    borderRadius: 20,
    // height: 45,
    alignItems: 'center',
    backgroundColor: colors.blek,
  },
  lubDisableBorder: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingTop: 5,
    borderColor: colors.opaWhite,
    backgroundColor: colors.safeArea,
    borderWidth: 0,
    borderRadius: width / 16,
    width: width - 3 * h_margin,
    flex: 1,
    marginVertical: 2,
    elevation: 3,
    height: 45,
  },
  lubHugeBorder: {
    paddingLeft: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingTop: 5,
    borderColor: colors.opaWhite,
    backgroundColor: colors.safeArea,
    borderWidth: 0,
    borderRadius: 30,
    width: width - 4 * h_margin,
    flex: 1,
    marginVertical: 2,
    elevation: 3,
    height: 60,
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
    // color: DefaultTheme.colors.placeholder,
    fontSize: 10,
    marginLeft: 15,
    width: 65,
    marginBottom: 10,
  },
  hmLabelActive: {
    // color: DefaultTheme.colors.placeholder,
    color: colors.blek,
    fontSize: 12,
    marginLeft: 10,
    width: 20,
    alignSelf: 'flex-start',
    textAlign: 'left',
    position: 'absolute',
    backgroundColor: colors.safeArea,
  },
  hmLabelInactive: {
    color: colors.blek,
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
    // borderRadius: 5,
  },
};

LubScreen.contextType = AppContext;
export default LubScreen;
