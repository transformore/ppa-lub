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
import {
  LoadingIndicator,
  ErrorData,
  InputOption,
  AutoResizeCard,
  Volume,
} from '../components';
import {colors} from '../styles';
import {AppContext} from '../context';
import Modal from 'react-native-modal';
import {AppExt} from '../utils';
import ImagePicker from 'react-native-image-crop-picker';
import FeatherIcons from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
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
    };
  }

  goBack = () => {
    this.props.route.params.goLubHistory();
    this.props.navigation.goBack();
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
  }
  _selectCard = (id) => {
    this.setState({selectedCard: id});
  };
  _setVolume = (val) => this.setState({volume: val});

  getLubData = () => {
    this.setState({loading: true});
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

  handleKirim = () => {
    if (
      this.state.volume == null ||
      this.state.hm == null ||
      this.state.storageId == null ||
      this.state.unitId == null ||
      this.state.locationId == null ||
      this.state.typeId == null ||
      this.state.componentId == null ||
      this.state.statusId == null
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
      this.setState({loading: true});
      Axios.post('/oilgreaseFinish', {
        nrp: this.context.userData.nrp,
        hm: this.state.hm,
        qty: this.state.volume,
        storage: this.state.storageOptions[this.state.storageId].name,
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
          backgroundColor={'#0F4C75'}
          translucent={false}
        />

        <Appbar.Header style={{zIndex: 3}}>
          <Appbar.BackAction onPress={this.goBack} />
          <Appbar.Content title="Grease Oil Transaction" />
        </Appbar.Header>

        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {this.state.loading ? (
            <LoadingIndicator />
          ) : this.state.requestError ? (
            <ErrorData onRetry={this.getLubData} />
          ) : (
            <ScrollView style={{flex: 1}}>
              <View
                style={{
                  paddingHorizontal: 13,
                  paddingBottom: 0,
                  // backgroundColor: Colors.white,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 20,
                    alignSelf: 'center',
                  }}
                />
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
                      ? styles.optiontext
                      : styles.lubTypeText
                  }
                  isSearchable={true}
                />
                {this.state.typeId !== null ? (
                  <View>
                    <AutoResizeCard
                      selected={this.state.selectedCard}
                      id={3}
                      onPress={() => this._selectCard(3)}
                      icon={'opacity'}
                      idleVal={this.state.volume}
                      idleTitle={'Volume'}
                      color={colors.yellow}>
                      <Volume
                        val={this.state.volume}
                        // val={2345}
                        onSet={this._setVolume}
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
                  label="STORAGE"
                  value={
                    this.state.storageId != null &&
                    this.state.storageOptions[this.state.storageId].name
                  }
                  optionData={this.state.storageOptions}
                  useIndexReturn={true}
                  onOptionChoose={(val) => this.setState({storageId: val})}
                  hasHelper={false}
                  style={styles.optiontext}
                  isSearchable={true}
                />
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
                  style={styles.optiontext}
                  isSearchable={true}
                />
                <InputOption
                  label="CODE NUMBER"
                  value={
                    this.state.unitId != null &&
                    this.state.unitOptions[this.state.unitId].name
                  }
                  optionData={this.state.unitOptions}
                  useIndexReturn={true}
                  onOptionChoose={(val) => this.setState({unitId: val})}
                  hasHelper={false}
                  style={styles.optiontext}
                  isSearchable={true}
                />
                <View style={styles.optiontext}>
                  <Text style={{marginLeft: 10, width: 121}}>HOURMETER</Text>
                  <Text style={{marginHorizontal: 10}}>:</Text>
                  <TextInput
                    disabled={this.state.hm == null}
                    mode="cotained"
                    style={{color: 'grey', fontSize: 25}}
                    label="Volume"
                    placeholder="....."
                    value={this.state.hm}
                    keyboardType="numeric"
                    onChangeText={(text) => this.setState({hm: text})}
                  />
                </View>
                <InputOption
                  label="KOMPONEN"
                  value={
                    this.state.componentId != null &&
                    this.state.componentOptions[this.state.componentId].name
                  }
                  optionData={this.state.componentOptions}
                  useIndexReturn={true}
                  onOptionChoose={(val) => this.setState({componentId: val})}
                  hasHelper={false}
                  style={styles.optiontext}
                  isSearchable={true}
                />
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
                  style={styles.optiontext}
                  isSearchable={true}
                />
              </View>
              {this.state.volume == null ||
              this.state.hm == null ||
              this.state.storageId == null ||
              this.state.unitId == null ||
              this.state.locationId == null ||
              this.state.typeId == null ||
              this.state.componentId == null ||
              this.state.statusId == null ? (
                <View style={{height: 0}} />
              ) : (
                <View style={{alignSelf: 'center'}}>
                  <TouchableNativeFeedback
                    onPress={() => this.showSendConfirm()}>
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
                      <Title style={{color: Colors.white}}>
                        Simpan dan Kirim
                      </Title>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              )}
              <View style={{height: 300}} />
              <Divider style={{height: 1.5}} />
            </ScrollView>
          )}
        </View>

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
    elevation: 3,
  },
  optiontext: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    // borderColor: '#0984e3',
    borderColor: '#F79F1F',
    // backgroundColor: '#81ecec',
    backgroundColor: '#dff9fb',
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width - 2 * h_margin,
    height: 50,
    marginVertical: 5,
    elevation: 3,
  },
  lubTypeText: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    // borderColor: '#0984e3',
    borderColor: '#F79F1F',
    // backgroundColor: '#81ecec',
    backgroundColor: '#dff9fb',
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width - 2 * h_margin,
    height: 70,
    marginVertical: 5,
    elevation: 3,
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

LubScreen.contextType = AppContext;
export default LubScreen;
