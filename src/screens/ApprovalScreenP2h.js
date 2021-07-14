import React, {Component, Fragment, useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TouchableNativeFeedback,
  VirtualizedList,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Appbar,
  Colors,
  Button,
  Divider,
  Title,
  List,
  Snackbar,
} from 'react-native-paper';

import {NoData, ErrorData, LoadingIndicator, BlinkingText} from '../components';
import axios from 'axios';
import Modal from 'react-native-modal';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppContext} from '../context';
// import {site} from '../constants';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
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

class ApprovalScreenP2h extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id_p2h: null,
      listData: [],
      ListItemP2h: [],
      historyList: [],
      doc: null,
      unitType: null,
      doc_no: '',
      rev_date: null,
      opt_nama: '',
      cn: '',
      tgl: '',
      hazard_code: '',
      opt_status: '',
      jam: '',
      remark: '',
      has_damage: false,
      item_damage: [],

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
      // .get('/waitingApprovalP2h/21000112')
      .get(`/waitingApprovalP2h/${this.context.userData.nrp}`)
      .then((res) => {
        const hasilListData = res.data.data.map((item) => {
          return {
            ...item,
            isReject: 3,
            remark: '',
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
        // alert(JSON.stringify(res.data.outstanding));
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

  _getDetailP2h = (id) => {
    axios
      .get(`/apprP2hDetail?id=${id}`)
      .then((res) => {
        this.setState({
          loading: false,
          refreshing: false,
          requestError: false,
          doc_no: res.data.document_no,
          rev_date: res.data.revision_date,
          opt_nama: res.data.opt_nama,
          cn: res.data.code_number,
          tgl: res.data.tanggal,
          hazard_code: res.data.hazard_code,
          jam: res.data.jam,
          remark: res.data.remark,
          has_damage: res.data.has_damage,
          item_damage: res.data.item_damage,
          opt_status: res.data.opt_status,
        });
        // alert(JSON.stringify(this.state.item_damage));
        this.RBSheet.open();
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
        .post('/doApprovementP2h', {
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
            <Appbar.Content title="Persetujuan P2H" />
          </Appbar.Header>
          <View
            style={{
              width: width,
              height: 30,
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#0984e3',
            }}>
            <Text style={styles.headertext}>CN || Opt</Text>
            <Text style={styles.headertext}> Status Opr</Text>
            <Text style={styles.headertext}>Kode Bahaya</Text>
            <Text style={styles.headertext}>Kerusakan</Text>
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
                // <ScrollView>
                <View>
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
                                <View style={{flexDirection: 'row'}}>
                                  <Icons
                                    name="bulldozer"
                                    size={25}
                                    color={'#8395a7'}
                                  />
                                  <Text>{item.code_number}</Text>
                                </View>

                                <Text style={styles.jabatantext}>
                                  {item.opt_nama}
                                </Text>
                                {/* <Text style={styles.jabatantext}>
                                  {item.id}
                                </Text> */}
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignSelf: 'flex-start',
                                  marginTop: 5,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    height: 30,
                                    alignItems: 'center',
                                  }}>
                                  <Text style={styles.jabatantext}>
                                    {item.opt_status}
                                  </Text>
                                  <Text style={styles.hazardcode}>
                                    {item.hazard_code}
                                  </Text>
                                </View>
                                <View style={{height: 30}} />
                                {item.has_damage === true ? (
                                  <View style={{marginLeft: 20, height: 50}}>
                                    <TouchableOpacity
                                      onPress={() => {
                                        // this._getDetailP2h();
                                        this._getDetailP2h(item.id);
                                      }}>
                                      <BlinkingText text={'!'} />
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  <View style={{height: 50}} />
                                )}
                              </View>
                            </View>
                            {/* <View
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
                            </View> */}
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignSelf: 'flex-start',
                            marginBottom: 10,
                            marginHorizontal: 5,
                          }}>
                          <Text style={styles.jabatantext}>PERSETUJUAN :</Text>
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
                          <Text style={styles.approvaltext}>Setuju</Text>
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
                </View>
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
                title="Stop Operasi"
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() =>
                  this.setReject(this.state.remarkDialogId, 2, 'Stop Operasi')
                }
              />
              <Divider />
              <List.Item
                title="Unit Tidak Sesuai"
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() =>
                  this.setReject(this.state.remarkDialogId, 2, 'P2H Salah')
                }
              />
              {/* <Divider />
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
              /> */}
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
        <RBSheet
          animationType={'fade'}
          closeOnDragDown
          height={height - 170}
          duration={200}
          onClose={() => this.setState({isMenuSheetOpen: false})}
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },

            container: {
              width: width - 10,
              marginHorizontal: 15,
              backgroundColor: 'white',
              borderColor: 'grey',
              borderRadius: 10,
              borderWidth: 0.5,
              bottom: 0,
              alignSelf: 'center',
            },
          }}>
          <View>
            <View
              style={{
                alignSelf: 'center',
                height: height - 200,
                // justifyContent: 'center',
                flexDirection: 'column',
                width: width - 40,
                borderWidth: 0.5,
                borderColor: Colors.grey300,
                padding: 10,
              }}>
              <View style={styles.container}>
                <Text style={styles.titletext}>SUMMARY LAPORAN</Text>
                <Text style={styles.titletext}>KERUSAKAN UNIT</Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                {/* <Icons name="file-document-outline" size={25} color={'grey500'} /> */}
                <Icons name="file-document" size={25} color={'grey500'} />
                <Text style={styles.icontext}>{this.state.doc_no}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                {/* <Text style={styles.itemtext}>Operator :</Text> */}
                <Icons name="account-circle" size={25} color={'grey500'} />
                <Text style={styles.icontext}>{this.state.opt_nama}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Icons name="bulldozer" size={25} color={'grey500'} />
                {/* <Text style={styles.itemtext}>Code Number :</Text> */}
                <Text style={styles.icontext}>{this.state.cn}</Text>
              </View>
              {/* <Text>{this.state.tgl}</Text> */}
              <View style={{flexDirection: 'row'}}>
                <Icons name="alert-outline" size={25} color={'orange'} />
                {/* <Text style={styles.itemtext}>Kode Bahaya :</Text> */}
                <Text style={styles.icontext}>{this.state.hazard_code}</Text>
              </View>
              {this.state.opt_status !== 'SIAP OPERASI' ? (
                <View style={{flexDirection: 'row'}}>
                  <Icons name="alert-octagon" size={25} color={'red'} />
                  <Text style={styles.icontext}>{this.state.opt_status}</Text>
                </View>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <Icons name="check" size={25} color={'green'} />
                  <Text style={styles.icontext}>{this.state.opt_status}</Text>
                </View>
              )}
              <View style={{marginTop: 25}}>
                <Text style={{fontWeight: 'bold'}}>Catatan Operator </Text>
                <Text style={{color: 'red', fontSize: 15}}>
                  {/* {JSON.stringify(this.state.item_damage)} */}
                </Text>
              </View>
              <FlatList
                data={this.state.item_damage}
                renderItem={({item}) => {
                  return (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{width: 160}}>{item.component}</Text>
                      <Text>{item.remark}</Text>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={Divider}
                contentContainerStyle={{padding: 0}}
              />

              {/* <View
                style={{
                  width: 300,
                  alignSelf: 'flex-start',
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                  marginTop: 0,
                }}>
                <Text style={{maxWidth: 300}}>Keterangan :</Text>
                <Text>{this.state.remark}</Text>
              </View> */}
            </View>
          </View>
        </RBSheet>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    marginBottom: 30,
  },
  titletext: {
    marginBottom: 0,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.blue800,
    maxWidth: 200,
    fontFamily: 'Fontisto',
  },
  itemtext: {
    fontSize: 13,
    marginVertical: 0,
    color: '#353b48',
    width: 130,
  },
  icontext: {
    marginLeft: 25,
    width: 300,
  },
  unittext: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
    marginLeft: 5,
    color: '#353b48',
    width: 130,
  },
  jabatantext: {
    fontSize: 11,
    fontWeight: '300',
    marginTop: 5,
    marginLeft: 5,
    color: '#353b48',
    width: 120,
  },
  approvaltext: {
    fontSize: 11,
    fontWeight: '300',
    marginTop: 5,
    color: '#353b48',
    width: 50,
  },
  hazardcode: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingVertical: 3,
    color: '#353b48',
    borderColor: '#0097e6',
    borderWidth: 1,
    borderRadius: 10,
    width: 50,
    textAlign: 'center',
    marginLeft: 20,
  },
  statusoprtext: {
    fontSize: 11,
    fontWeight: '300',
    marginTop: 5,
    marginLeft: 5,
    color: '#353b48',
    width: 120,
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

ApprovalScreenP2h.contextType = AppContext;
export default ApprovalScreenP2h;
