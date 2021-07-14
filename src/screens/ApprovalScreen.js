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
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  Appbar,
  Colors,
  Button,
  Divider,
  Title,
  // TextInput,
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
const {width, height} = Dimensions.get('screen');

function FooterComponent(props) {
  return (
    <>
      <View>
        <TouchableNativeFeedback onPress={() => props.onSendPreUseCheck()}>
          <View style={styles.sendbutton}>
            <Title
              style={{
                color: Colors.white,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Kirim
            </Title>
          </View>
        </TouchableNativeFeedback>
      </View>
    </>
  );
}

class ApprovalScreen extends Component {
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
      nrp: null,
      nama: null,
      isReject: 3,

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

  setReject = (id, isRejected, remark = '') => {
    const listData = this.state.listData.map((item, index) => {
      if (index === id) {
        return {...item, isReject: isRejected, remark: remark};
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

  showRemarkDialog = (id) => {
    this.setState({
      isRemarkDialogVisible: true,
      remarkDialogId: id,
      remarkText: this.state.listData[id].remark,
    });
  };

  _getListData = () => {
    axios
      .get(`/waitingApproval/${this.context.userData.nrp}`)
      .then((res) => {
        const hasilListData = res.data.data.map((item) => {
          return {
            ...item,
            isReject: 3,
            // remark: '',
            approver: this.context.userData.nrp,
          };
        });

        this.setState({
          loading: false,
          refreshing: false,
          requestError: false,
          listData: hasilListData,
          dataList: res.data.data,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          refreshing: false,
          requestError: true,
        });
        alert('Something wrong !!');
      });
  };

  _reload = () => {
    this.setState({loading: true}, this._getListData);
  };

  componentDidMount() {
    this._reload();
  }

  goBack = () => {
    // this.context.setApprovalUpdate(true);
    // this.props.navigation.navigate('Home', {
    //   itemId: '999',
    //   otherParam: 'update',
    // });
    this.props.route.params.goHome();
    this.props.navigation.goBack();
  };

  showSnackbar = (msg) => {
    this.setState({snackbarVisible: true, snackbarMsg: msg});
  };

  hideSnackbar = () => {
    this.setState({snackbarVisible: false, snackbarMsg: null});
  };

  sendPreUseCheck = () => {
    const isNoChecked = this.state.listData.some(
      (item) => item.isReject == null,
    );

    if (isNoChecked) {
      this.showSnackbar('Lengkapi isian!');
    } else {
      this.setState({isScreenLoading: true});

      const response = this.state.listData.map(
        ({component_name, ...keepAttrs}) => keepAttrs,
      );
      // alert(JSON.stringify(response));

      axios
        .post('/doApprovement', {
          apprdata: JSON.stringify(response),
        })
        .then((response) => {
          this.setState({
            isScreenLoading: false,
          });
          alert('message ' + response.data.message);
          setTimeout(() => {
            this.goBack();
          }, 1000);
        })
        .catch((error) => {
          this.setState({isScreenLoading: false});
          alert('error' + error);
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
            <Appbar.Content title="Persetujuan Revisi Absen" />
            {/* <Appbar.Action
              disabled={this.state.loading}
              icon="history"
              onPress={() => this.setIsHistoryDialogVisible(true)}
            /> */}
          </Appbar.Header>
          <View
            style={{
              width: width,
              height: 30,
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#0984e3',
            }}>
            <Text style={styles.headertext}>Pemohon</Text>
            <Text style={styles.headertext}>Tanggal</Text>
            <Text style={styles.headertext}>Checkin</Text>
            <Text style={styles.headertext}>Checkout</Text>
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
                    scrollEnabled={true}
                    keyboardShouldPersistTaps={'always'}
                    // style={{ backgroundColor: background }}
                    data={this.state.listData}
                    getItem={(data, index) => data[index]}
                    getItemCount={(data) => data.length}
                    // extraData={this.state}
                    renderItem={({item, index}) => (
                      <View
                        style={{
                          flexDirection: 'column',
                          backgroundColor: Colors.white,
                        }}>
                        <View
                          style={{
                            marginHorizontal: 5,
                            flexDirection: 'row',
                            flex: 1,
                          }}>
                          <View
                            style={{
                              flex: 1,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignSelf: 'flex-start',
                                marginTop: 5,
                              }}>
                              <View>
                                <Text style={styles.nametext}>{item.nama}</Text>
                                <Text style={styles.jabatantext}>
                                  {item.posisi}
                                </Text>
                              </View>
                              <View style={{flexDirection: 'column'}}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignSelf: 'flex-start',
                                    marginTop: 5,
                                  }}>
                                  {/* <Text style={styles.itemtext}>{item.nrp}</Text> */}
                                  <Text style={styles.datetext}>
                                    {item.tanggal}
                                  </Text>
                                  <Text style={styles.timetext}>{item.in}</Text>
                                  <Text style={styles.timetext}>
                                    {item.out}
                                  </Text>
                                </View>
                                <View
                                  style={{flexDirection: 'row', marginTop: 10}}>
                                  <Text
                                    style={{
                                      fontSize: 11,
                                      textAlign: 'left',
                                      marginTop: 5,
                                    }}>
                                    Roster :
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 11,
                                      textAlign: 'left',
                                      marginTop: 5,
                                      marginLeft: 5,
                                    }}>
                                    {item.roster}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignSelf: 'flex-start',
                                marginBottom: 5,
                              }}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                alignSelf: 'flex-start',
                                marginBottom: 10,
                              }}>
                              <Text style={styles.alasantext}>
                                Kategori Revisi :
                              </Text>
                              <Text style={styles.reasontext}>
                                {item.reason}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignSelf: 'flex-start',
                                marginBottom: 10,
                              }}>
                              <Text style={styles.alasantext}>
                                Alasan Revisi :
                              </Text>
                              <Text style={styles.reasontext}>
                                {item.remark}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignSelf: 'flex-start',
                            marginBottom: 10,
                            marginHorizontal: 5,
                          }}>
                          <Text style={styles.alasantext}>Disetujui :</Text>
                          <TouchableOpacity
                            onPress={() => {
                              // if (item.isReject == 1 || item.isReject == 2) {
                              this.setReject(index, 3);
                              // } else {
                              //   this.setReject(index, 3);
                              // }
                            }}>
                            <View
                              style={{
                                marginLeft: 0,
                                marginRight: 0,
                              }}>
                              <Icons
                                name="pause-circle"
                                size={25}
                                color={
                                  item.isReject == 3
                                    ? Colors.blue300
                                    : Colors.grey300
                                }
                              />
                            </View>
                          </TouchableOpacity>
                          <Text style={styles.approvaltext}>Tunda</Text>
                          <TouchableOpacity
                            onPress={() => {
                              if (item.isReject == 2 || item.isReject == 3) {
                                this.setReject(index, 1);
                              } else {
                                this.setReject(index);
                              }
                            }}>
                            <View
                              style={{
                                marginLeft: 15,
                              }}>
                              <Icons
                                name="checkbox-marked"
                                size={25}
                                color={
                                  item.isReject === 1
                                    ? Colors.lightGreen400
                                    : Colors.grey300
                                }
                              />
                            </View>
                          </TouchableOpacity>
                          <Text style={styles.approvaltext}>Ya</Text>
                          <TouchableOpacity
                            onPress={() => {
                              // if (item.isReject == 1 || item.setReject == 3) {
                              this.setReject(index, 2);
                              // } else {
                              this.showRemarkDialog(index);
                              // ?                              }
                            }}>
                            <View
                              style={{
                                marginLeft: 5,
                                marginRight: 0,
                              }}>
                              <Icons
                                name="close-circle"
                                size={25}
                                color={
                                  item.isReject == 2
                                    ? Colors.red300
                                    : Colors.grey300
                                }
                              />
                            </View>
                          </TouchableOpacity>
                          <Text style={styles.approvaltext}>Tidak</Text>
                        </View>
                        {item.isReject == 2 && (
                          <View style={{flexDirection: 'row', marginLeft: 5}}>
                            <Text style={styles.alasantext}>
                              Alasan Reject :
                            </Text>
                            <Text style={styles.rejecttext}>
                              {` ${item.remark}`}
                            </Text>
                          </View>
                        )}
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
                    // glListData={this.state.glList}
                    onSendPreUseCheck={this.sendPreUseCheck}
                  />
                </ScrollView>
              )}
            </View>
          )}
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
              <Title>Keterangan Reject</Title>
              {/* <Text>Masukan keterangan</Text> */}
            </View>
            <View>
              <Divider />
              <List.Item
                title="Roster cuti/off"
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() =>
                  this.setReject(
                    this.state.remarkDialogId,
                    2,
                    'Roster cuti/off',
                  )
                }
              />
              <Divider />
              <List.Item
                title="Sakit/ijin/alpa"
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() =>
                  this.setReject(this.state.remarkDialogId, 2, 'Tidak hadir')
                }
              />
              <Divider />
              <List.Item
                title="Jam kerja tidak sesuai"
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() =>
                  this.setReject(
                    this.state.remarkDialogId,
                    2,
                    'Jam kerja tidak sesuai',
                  )
                }
              />
              <Divider />
            </View>
            <View style={{padding: 10}}>
              <Button
                mode="contained"
                onPress={() => {
                  if (!this.state.remarkText) {
                    this.showSnackbar('Pilih remark terlebih dahulu');
                  } else {
                    this.setReject(
                      this.state.remarkDialogId,
                      2,
                      this.state.remarkText,
                    );
                  }
                }}>
                Ok
              </Button>
            </View>
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

const styles = StyleSheet.create({
  rejecttext: {
    // fontFamily: "Gruppo-Regular",
    fontSize: 12,
    marginVertical: 0,
    marginLeft: 0,
    color: 'red',
    // width: (width / 4) * 3,
  },
  reasontext: {
    // fontFamily: "Gruppo-Regular",
    fontSize: 12,
    marginVertical: 0,
    marginLeft: 0,
    color: '#353b48',
    // width: (width / 4) * 3,
  },
  alasantext: {
    // fontFamily: "Gruppo-Regular",
    fontSize: 12,
    marginVertical: 0,
    marginLeft: 5,
    color: '#353b48',
    width: 110,
  },
  approvaltext: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    marginLeft: 5,
    color: '#353b48',
    width: 40,
  },
  nametext: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 5,
    color: '#353b48',
    maxWidth: 110,
  },
  jabatantext: {
    fontSize: 11,
    fontWeight: '300',
    marginTop: 5,
    marginLeft: 5,
    color: '#353b48',
    width: 110,
  },
  timetext: {
    // fontFamily: "Gruppo-Regular",
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 3,
    color: '#353b48',
    borderColor: '#0097e6',
    borderWidth: 1,
    borderRadius: 10,
    width: (width / 18) * 4 - 10,
    textAlign: 'center',
  },
  datetext: {
    // fontFamily: 'Gruppo-Regular',
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 3,
    color: 'orange',
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 10,
    width: (width / 18) * 4 - 5,
    textAlign: 'center',
  },
  sendbutton: {
    color: 'white',
    backgroundColor: 'orange',
    borderRadius: 25,
    width: 200,
    height: 50,
    marginTop: 20,
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  headertext: {
    height: 35,
    // fontFamily: 'Gruppo-Regular',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 3,
    color: 'white',
    backgroundColor: '#0984e3',
    width: width / 4,
    textAlign: 'center',
    marginBottom: 25,
  },
});

ApprovalScreen.contextType = AppContext;
export default ApprovalScreen;
