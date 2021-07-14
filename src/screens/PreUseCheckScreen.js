import React, {Component, Fragment, useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TouchableNativeFeedback,
  VirtualizedList,
  Alert,
  Linking,
} from 'react-native';
import {
  Appbar,
  Colors,
  Button,
  Divider,
  Title,
  TextInput,
  List,
  Snackbar,
  ActivityIndicator,
  Caption,
  Drawer,
} from 'react-native-paper';

import {NoData, ErrorData, LoadingIndicator} from '../components';
import axios from 'axios';
import Modal from 'react-native-modal';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppContext} from '../context';
import {site} from '../constants';

import {ScrollView} from 'react-native-gesture-handler';

function FooterComponent(props) {
  const [finalRemarkText, setFinalRemarkText] = useState('');
  const [hazardObj, setHazardObj] = useState('');
  const [oprStatusObj, setOprStatusCode] = useState('');
  const [glObj, setGlObj] = useState('');
  const [isHazardDialogVisible, setIsHazardDialogVisible] = useState(false);
  const [isOprStatusDialogVisible, setIsOprStatusDialogVisible] = useState(
    false,
  );
  const [isGlDialogVisible, setIsGlDialogVisible] = useState(false);

  const hazardList = [
    {code: 'H', label: 'H: Stop Operasi Perbaiki segera'},
    {code: 'S', label: 'S: Perbaiki dalam 24 jam'},
    {code: 'M', label: 'M: Perbaiki saat service / backlog'},
    {code: 'L', label: 'L: OK'},
    // { code: "L", label: "C: Perbaiki saat service / backlog" },
  ];
  const oprStatusList = [
    {code: '1', label: 'Siap operasi'},
    {code: '2', label: 'Siap operasi bersyarat'},
    {code: '3', label: 'Tidak siap operasi'},
  ];

  return (
    <>
      <View>
        <View style={{height: 15, backgroundColor: Colors.grey200}} />
        <Button
          onPress={() => setIsHazardDialogVisible(true)}
          color={Colors.teal500}
          style={{
            marginHorizontal: 15,
            marginVertical: 5,
            marginTop: 15,
            elevation: 0,
          }}
          mode="contained">
          {hazardObj ? `Hazard: ${hazardObj.label}` : 'Kode Bahaya'}
        </Button>
        <Button
          onPress={() => setIsOprStatusDialogVisible(true)}
          color={Colors.cyan600}
          style={{marginHorizontal: 15, marginVertical: 5, elevation: 0}}
          mode="contained">
          {oprStatusObj
            ? `Opr Status: ${oprStatusObj.label}`
            : 'Status Operasional'}
        </Button>
        <Button
          onPress={() => setIsGlDialogVisible(true)}
          color={Colors.lightBlue500}
          style={{marginHorizontal: 15, marginVertical: 5, elevation: 0}}
          mode="contained">
          {glObj ? `GL: ${glObj.nama}` : 'Pilih GL'}
        </Button>
        <TextInput
          style={{margin: 15, marginTop: 3}}
          mode="outlined"
          label="Operator Remark"
          value={finalRemarkText}
          placeholder="Remark description"
          onChangeText={(text) => setFinalRemarkText(text)}
        />
        <TouchableNativeFeedback
          onPress={() =>
            props.onSendPreUseCheck(
              finalRemarkText,
              oprStatusObj.code,
              hazardObj.code,
              glObj.nrp,
            )
          }>
          <View
            style={{
              height: 50,
              backgroundColor: Colors.green500,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Title style={{color: Colors.white}}>Kirim</Title>
          </View>
        </TouchableNativeFeedback>
      </View>

      <Modal
        onBackdropPress={() => setIsHazardDialogVisible(false)}
        onBackButtonPress={() => setIsHazardDialogVisible(false)}
        isVisible={isHazardDialogVisible}
        animationIn="fadeInUp"
        animationOut="fadeOutDown">
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 10,
          }}>
          <FlatList
            data={hazardList}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={Divider}
            renderItem={({item, index}) => {
              return (
                <List.Item
                  title={item.label}
                  right={(props) => (
                    <List.Icon {...props} icon="chevron-right" />
                  )}
                  onPress={() => {
                    setHazardObj(item);
                    setIsHazardDialogVisible(false);
                  }}
                />
              );
            }}
          />
        </View>
      </Modal>
      <Modal
        onBackdropPress={() => setIsOprStatusDialogVisible(false)}
        onBackButtonPress={() => setIsOprStatusDialogVisible(false)}
        isVisible={isOprStatusDialogVisible}
        animationIn="fadeInUp"
        animationOut="fadeOutDown">
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 10,
          }}>
          <FlatList
            data={oprStatusList}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={Divider}
            renderItem={({item, index}) => {
              return (
                <List.Item
                  title={item.label}
                  right={(props) => (
                    <List.Icon {...props} icon="chevron-right" />
                  )}
                  onPress={() => {
                    setOprStatusCode(item);
                    setIsOprStatusDialogVisible(false);
                  }}
                />
              );
            }}
          />
        </View>
      </Modal>

      <Modal
        onBackdropPress={() => setIsGlDialogVisible(false)}
        onBackButtonPress={() => setIsGlDialogVisible(false)}
        isVisible={isGlDialogVisible}
        animationIn="fadeInUp"
        animationOut="fadeOutDown">
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 10,
          }}>
          <FlatList
            data={props.glListData}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={Divider}
            renderItem={({item, index}) => {
              return (
                <List.Item
                  title={item.nama}
                  description={item.nrp}
                  right={(props) => (
                    <List.Icon {...props} icon="chevron-right" />
                  )}
                  onPress={() => {
                    setGlObj(item);
                    setIsGlDialogVisible(false);
                  }}
                />
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

class PreUseCheckScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listData: [],
      glList: [],
      historyList: [],
      doc: null,
      unitType: null,

      loading: false,
      refreshing: false,
      requestError: false,
      unit: null,
      isDamage: true,

      isRemarkDialogVisible: false,
      remarkText: '',
      remarkDialogId: null,

      finalRemarkText: '',
      hazardCode: null,

      snackbarVisible: false,
      snackbarMsg: '',

      isScreenLoading: false,

      isHistoryDialogVisible: false,
    };
  }

  componentDidMount() {
    this._reload();
  }

  openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  setDamage = (id, isDamaged, remark = '') => {
    const listData = this.state.listData.map((item, index) => {
      if (index == id) {
        return {...item, isDamage: isDamaged, remark: remark};
      }
      return item;
    });

    this.setState({
      isRemarkDialogVisible: false,
      remarkText: '',
      remarkDialogId: null,
      listData,
    });
  };

  _getListData = () => {
    axios
      .get(
        `/p2hForm/${this.context.status.unit}/${this.context.userData.nrp}`,
        // `/p2hFormData/${this.context.status.unit}`
      )
      .then((res) => {
        const hasilListData = res.data.item_check.map((item) => {
          return {...item, isDamage: null, remark: ''};
        });

        // alert(JSON.stringify(res.data.gl));

        this.setState({
          loading: false,
          refreshing: false,
          requestError: false,
          listData: hasilListData,
          glList: res.data.gl,
          historyList: res.data.history,
          doc: res.data.form_data.doc,
          unitType: res.data.form_data.unit_type,
        });
        // alert(JSON.stringify(this.state.historyList));
      })
      .catch((error) => {
        this.setState({
          loading: false,
          refreshing: false,
          requestError: true,
        });
        alert(
          'Anda harus memiliki SIMPER dan pastikan sudah melakukan checkin unit !',
        );
      });
  };

  _reload = () => {
    this.setState({loading: true}, this._getListData);
  };

  _refresh = () => {
    this.setState({refreshing: true}, this._getListData);
  };

  showRemarkDialog = (id) => {
    this.setState({
      isRemarkDialogVisible: true,
      remarkDialogId: id,
      remarkText: this.state.listData[id].remark,
    });
  };

  setIsHistoryDialogVisible = (isVisible) => {
    this.setState({
      isHistoryDialogVisible: isVisible,
    });
  };

  onRemarkTextChange = (text) => {
    this.setState({remarkText: text});
  };

  goBack = () => {
    this.props.navigation.navigate('Home');
    // alert("sss");
  };

  showSnackbar = (msg) => {
    this.setState({snackbarVisible: true, snackbarMsg: msg});
  };

  hideSnackbar = () => {
    this.setState({snackbarVisible: false, snackbarMsg: null});
  };

  sendPreUseCheck = (remarkText, oprStatusCode, HazardCode, glNrp) => {
    const isNoChecked = this.state.listData.some(
      (item) => item.isDamage == null,
    );

    const isvalid =
      remarkText && oprStatusCode && HazardCode && glNrp && !isNoChecked;

    if (!isvalid) {
      this.showSnackbar('Lengkapi isian!');
    } else {
      this.setState({isScreenLoading: true});

      const response = this.state.listData.map(
        ({component_name, ...keepAttrs}) => keepAttrs,
      );

      axios
        .post('/p2h', {
          shift: this.context.status.roster,
          type: this.state.unitType,
          nrp: this.context.userData.nrp,
          cn: this.context.status.unit,
          doc: this.state.doc,
          remark: remarkText,
          opr_status: oprStatusCode,
          hazard: HazardCode,
          gl: glNrp,
          response: JSON.stringify(response),
        })
        .then((response) => {
          this.setState({
            isScreenLoading: false,
          });
          alert(response.data.message);
          setTimeout(() => {
            this.goBack();
          }, 700);
        })
        .catch((error) => {
          this.setState({isScreenLoading: false});
          alert(error);
        });
    }
  };

  render() {
    return (
      <Fragment>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={'#0F4C75'}
          translucent={false}
        />
        <SafeAreaView style={{flex: 1}}>
          <Appbar.Header style={{zIndex: 3}}>
            <Appbar.BackAction onPress={this.goBack} />
            <Appbar.Content title="Pre Use Check (P2H)" />
            <Appbar.Action
              disabled={this.state.loading}
              icon="download"
              size={30}
              color={'red'}
              onPress={() => this.setIsHistoryDialogVisible(true)}
            />
          </Appbar.Header>
          {/* <Masterlist goBack={this.goBack} /> */}
          <View style={{flex: 1, zIndex: 0}}>
            <View style={{marginHorizontal: 20, marginBottom: 15}}>
              <Text style={{color: 'red'}}>
                Note : Jika item/komponen tidak terdapat di unit silakan pilih X
                dan berikan keterangan "NA" .
              </Text>
            </View>
            {this.state.loading ? (
              <LoadingIndicator />
            ) : this.state.requestError ? (
              <ErrorData onRetry={this._reload} />
            ) : (
              <View style={{flex: 1}}>
                {!this.state.listData.length ? (
                  <NoData />
                ) : (
                  <ScrollView>
                    <VirtualizedList
                      scrollEnabled={false}
                      keyboardShouldPersistTaps={'always'}
                      // style={{ backgroundColor: background }}
                      data={this.state.listData}
                      getItem={(data, index) => data[index]}
                      getItemCount={(data) => data.length}
                      // extraData={this.state}
                      renderItem={({item, index}) => (
                        <View
                          style={{
                            flexDirection: 'row',
                            backgroundColor: Colors.white,
                          }}>
                          <View
                            style={{
                              marginHorizontal: 10,
                              marginVertical: 7,
                              flexDirection: 'row',
                              flex: 1,
                            }}>
                            <View
                              style={{
                                flex: 1,
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'Nunito-Medium',
                                  fontSize: 16,
                                  paddingVertical: 3,
                                  color: '#1F4068',
                                  // color: "black",
                                }}>
                                {item.component_name}
                              </Text>
                            </View>
                            {item.isDamage && (
                              <Text
                                style={{
                                  fontFamily: 'Nunito-Medium',
                                  fontSize: 18,
                                  color: Colors.red700,
                                  fontWeight: 'bold',
                                }}>
                                {` [${item.remark}]`}
                              </Text>
                            )}
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              if (item.isDamage == false) {
                                this.setDamage(index, null);
                              } else {
                                this.setDamage(index, false);
                              }
                            }}>
                            <View
                              style={{
                                margin: 5,
                                marginLeft: 0,
                              }}>
                              <Icons
                                name="checkbox-marked"
                                size={25}
                                color={
                                  item.isDamage == false
                                    ? Colors.lightGreen400
                                    : Colors.grey300
                                }
                              />
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              if (item.isDamage) {
                                this.setDamage(index, null);
                              } else {
                                this.showRemarkDialog(index);
                              }
                            }}>
                            <View
                              style={{
                                margin: 5,
                                marginRight: 10,
                              }}>
                              <Icons
                                name="close-circle"
                                size={25}
                                color={
                                  item.isDamage == true
                                    ? Colors.red300
                                    : Colors.grey300
                                }
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      ItemSeparatorComponent={() => (
                        <View
                          style={{
                            height: 3,
                            backgroundColor: Colors.grey200,
                          }}
                        />
                      )}
                    />
                    <FooterComponent
                      glListData={this.state.glList}
                      onSendPreUseCheck={this.sendPreUseCheck}
                    />
                  </ScrollView>
                )}
              </View>
            )}
          </View>
        </SafeAreaView>

        <Modal
          onBackdropPress={() =>
            this.setState({
              isRemarkDialogVisible: false,
              remarkText: '',
              remarkDialogId: null,
            })
          }
          onBackButtonPress={() =>
            this.setState({
              isRemarkDialogVisible: false,
              remarkText: '',
              remarkDialogId: null,
            })
          }
          isVisible={this.state.isRemarkDialogVisible}
          animationIn="fadeInUp"
          animationOut="fadeOutDown">
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
            }}>
            <View style={{padding: 15}}>
              <Title>Remark</Title>
              <Text>Masukan keterangan</Text>
            </View>
            <View>
              <Divider />
              <List.Item
                title="Rusak"
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() =>
                  this.setDamage(this.state.remarkDialogId, true, 'Rusak')
                }
              />
              <Divider />
              <List.Item
                title="Kurang"
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() =>
                  this.setDamage(this.state.remarkDialogId, true, 'Kurang')
                }
              />
              <Divider />
              <List.Item
                title="Hilang"
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() =>
                  this.setDamage(this.state.remarkDialogId, true, 'Hilang')
                }
              />
              <Divider />
            </View>
            <TextInput
              mode="outlined"
              style={{margin: 10}}
              label="Lainnya"
              value={this.state.remarkText}
              onChangeText={(text) => this.onRemarkTextChange(text)}
            />
            <Divider />
            <View style={{padding: 10}}>
              <Button
                mode="contained"
                onPress={() => {
                  if (!this.state.remarkText) {
                    this.showSnackbar('Pilih remark terlebih dahulu');
                  } else {
                    this.setDamage(
                      this.state.remarkDialogId,
                      true,
                      this.state.remarkText,
                    );
                  }
                }}>
                Ok
              </Button>
            </View>
          </View>
        </Modal>

        <Modal
          onBackdropPress={() => this.setIsHistoryDialogVisible(false)}
          onBackButtonPress={() => this.setIsHistoryDialogVisible(false)}
          isVisible={this.state.isHistoryDialogVisible}
          animationIn="fadeInDown"
          animationOut="fadeOutUp">
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
            }}>
            {this.state.historyList.length ? (
              <FlatList
                data={this.state.historyList}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={Divider}
                ListHeaderComponent={() => (
                  <View style={{paddingHorizontal: 15, paddingTop: 10}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icons name="history" size={30} color={Colors.black} />
                      <Title style={{paddingLeft: 10}}>History</Title>
                    </View>
                    <Divider style={{marginTop: 5}} />
                  </View>
                )}
                renderItem={({item, index}) => {
                  return (
                    <List.Item
                      title={item.code_number}
                      description={item.status}
                      right={(props) => (
                        <List.Icon {...props} icon="find-in-page" />
                      )}
                      onPress={() => {
                        this.openURL(
                          `${
                            site[this.context.siteId].apiUrl[
                              this.context.isPublicNetwork ? 'public' : 'local'
                            ]
                          }/api/cico/${item.url_download2}`,
                        );
                      }}
                    />
                  );
                }}
              />
            ) : (
              <View style={{paddingHorizontal: 15, paddingTop: 10}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icons name="history" size={30} color={Colors.black} />
                  <Title style={{paddingLeft: 10}}>History</Title>
                </View>
                <Divider style={{marginTop: 5}} />
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 75,
                  }}>
                  <Caption>Tidak ada riwayat</Caption>
                </View>
              </View>
            )}
          </View>
        </Modal>

        <Modal
          isVisible={this.state.isScreenLoading}
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

        <Snackbar
          visible={this.state.snackbarVisible}
          onDismiss={this.hideSnackbar}
          duration={3000}>
          {this.state.snackbarMsg}
        </Snackbar>
      </Fragment>
    );
  }
}

PreUseCheckScreen.contextType = AppContext;

export default PreUseCheckScreen;
