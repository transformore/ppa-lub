import React, {Component, useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  Dimensions,
  Linking,
  TouchableNativeFeedback,
  Keyboard,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  Colors,
  Appbar,
  Caption,
  Divider,
  FAB,
  Title,
  IconButton,
  Button,
  // TextInput,
  // Card,
} from 'react-native-paper';
import Axios from 'axios';
import {LoadingIndicator, ErrorData, InputOption} from '../components';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import {AppContext} from '../context';
import {site} from '../constants';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {FormatingDate} from '../utils';
// import DatePicker from 'react-native-datepicker';
const {width, height} = Dimensions.get('screen');
const h_margin = 15;

class LubHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageOptions: null, //code_number,type
      storagId: null, //code_number,type
      listLub: [],
      isLoading: true,
      isRequestError: false,
      isStorageDialogVisible: false,
      historyList: [],
      tgl_now: new Date().getTime(),
      tgl_revisi: new Date().getTime() + 1,
    };
  }

  componentDidMount() {
    this.getLub();
    this.getStorage();
    // alert(this.state.tgl_now);
  }
  showStorageDialog = () => {
    this.setState({isStorageDialogVisible: true});
  };
  hideStorageDialog = () => {
    this.setState({isStorageDialogVisible: false});
  };

  goToTransaction = () => {
    this.context.setOilGreaseStorage(
      this.state.storageOptions[this.state.storageId].name,
    );
    this.hideStorageDialog();
    this.props.navigation.navigate('Oil & Grease Transaction');
  };
  getStorage = () => {
    Axios.get(`/oilgreaseForm/${this.context.userData.nrp}`)
      .then((res) => {
        const formattedStorage = res.data.storage.map((item, index) => ({
          id: index,
          code: item.type,
          name: item.code_number,
        }));
        this.setState({
          isLoading: false,
          isRequestError: false,
          storageOptions: formattedStorage,
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

  openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  getLub = () => {
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
        // alert(JSON.stringify(this.state.listLub));
      })
      .catch((error) => {
        alert(error);
        this.setState({
          isLoading: false,
          isRequestError: true,
        });
      });
  };

  render() {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={'transparent'}
          translucent={false}
        />

        {/* <Appbar.Header style={{zIndex: 3}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Oil Grease Transaction History" /> */}
        {/* <Appbar.Action
            disabled={this.state.loading}
            icon="download"
            size={32}
            color={'red'}
            onPress={() => {
              this.openURL(
                `${
                  site[this.context.siteId].apiUrl[
                    this.context.isPublicNetwork ? 'public' : 'local'
                  ]
                }/api/cico/generate_ot/${this.context.userData.nrp}`,
              );
            }}
          /> */}
        {/* </Appbar.Header> */}
        <View
          style={{
            backgroundColor: '#0984e3',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              paddingLeft: 10,
              paddingVertical: 10,
              fontSize: 18,
              color: Colors.white,
              width: 65,
              marginVertical: 1,
            }}>
            Date
          </Text>

          <Text
            style={{
              paddingLeft: 0,
              paddingVertical: 10,
              fontSize: 18,
              color: Colors.white,
              width: 45,
              marginVertical: 1,
            }}>
            CN
          </Text>

          <Text
            style={{
              paddingLeft: 5,
              paddingVertical: 10,
              fontSize: 18,
              color: Colors.white,
              width: 50,
              marginVertical: 1,
            }}>
            HM
          </Text>

          <Text
            style={{
              paddingLeft: 10,
              paddingVertical: 10,
              fontSize: 18,
              color: Colors.white,
              width: 90,
              marginVertical: 1,
            }}>
            Volume
          </Text>

          <Text
            style={{
              paddingLeft: 15,
              paddingVertical: 10,
              fontSize: 18,
              color: Colors.white,
              marginVertical: 1,
            }}>
            Jenis Pelumas
          </Text>
        </View>

        <View style={{flex: 1}}>
          {this.state.isLoading ? (
            <LoadingIndicator />
          ) : this.state.isRequestError ? (
            <ErrorData onRetry={this.getLub} />
          ) : !this.state.listLub ? (
            <>
              <View style={{height: 30}} />
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
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
                      backgroundColor:
                        item.rev_status === '0'
                          ? Colors.yellow100
                          : item.rev_status === '1'
                          ? '#C4E538'
                          : item.rev_status === '2'
                          ? '#ea8685'
                          : Colors.grey100,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        paddingLeft: 15,
                        alignSelf: 'center',
                        paddingVertical: 5,
                        color: Colors.grey700,
                        backgroundColor: 'transparent',
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
                        color: Colors.blue500,
                        backgroundColor: 'transparent',
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
                        color: Colors.grey700,
                        backgroundColor: 'transparent',
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
                        color: Colors.orange700,
                        backgroundColor: 'transparent',
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
                        color: Colors.grey700,
                        backgroundColor: 'transparent',
                        flex: 1,
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

        <FAB
          style={styles.fab}
          icon="plus"
          size={20}
          onPress={() => {
            this.showStorageDialog();
          }}
          // onPress={() => {
          //   this.props.navigation.navigate('Oil & Grease Transaction', {
          //     goLubHistory: () => this.getLub(),
          //   });
          // }}
        />
        <Modal
          isVisible={this.state.isStorageDialogVisible}
          onBackButtonPress={this.hideRosterDialog}
          onBackdropPress={this.hideRosterDialog}
          animationIn="fadeInUp"
          animationOut="fadeOutDown">
          <View style={{backgroundColor: 'grey', flex: 1}}>
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
              style={
                this.state.storageId == null
                  ? styles.optiontextborder
                  : styles.disableBorder
              }
              isSearchable={true}
            />
            <TouchableNativeFeedback
              delayPressIn={0}
              background={TouchableNativeFeedback.Ripple(Colors.green200)}
              onPress={() => {
                this.state.storageId == null ? null : this.goToTransaction();
                Keyboard.dismiss();
              }}>
              {this.state.storageId == null ? (
                <View style={{height: 0}} />
              ) : (
                <View
                  style={{
                    backgroundColor: 'orange',
                    borderRadius: 25,
                    height: 50,
                    width: 150,
                    marginVertical: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text>Confirm</Text>
                </View>
              )}
            </TouchableNativeFeedback>
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 20,
    right: 15,
    bottom: 10,
  },
});

LubHistory.contextType = AppContext;
export default LubHistory;
