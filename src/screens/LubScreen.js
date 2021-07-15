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

export class LubScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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
    };
  }

  goBack = () => {
    this.props.route.params.onGoBack();
    this.props.navigation.goBack();
  };

  componentDidMount() {
    this.getLubData();
  }

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
        const formattedUnit = res.data.type.map((item, index) => ({
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
    const sisaplafon = parseFloat(this.state.plafon.plafonSkrg);

    if (
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

        <View style={{flex: 1, backgroundColor: Colors.grey200}}>
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
                  backgroundColor: Colors.white,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 20,
                    alignSelf: 'center',
                  }}
                />

                {/* storageId: null, //code_number,type
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
      statusOptions: null, //value , text */}

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
                  style={styles.optiontext}
                  isSearchable={true}
                />
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

LubScreen.contextType = AppContext;
export default LubScreen;
