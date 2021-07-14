import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  StatusBar,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {
  Colors,
  FAB,
  Avatar,
  Divider,
  Button,
  List,
  Title,
  Caption,
  Snackbar,
  ActivityIndicator,
  Headline,
  Appbar,
} from 'react-native-paper';

import {ScrollView} from 'react-native-gesture-handler';
import Axios from 'axios';
import {LoadingIndicator, ErrorData, InputOption} from '../components';
import {AppContext} from '../context';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import RBSheet from 'react-native-raw-bottom-sheet';

const {width, height} = Dimensions.get('screen');
const h_margin = 15;
const safeAreaView_height = 35;

export class LeavingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      refreshing: false,
      requestError: false,

      stagingLeaves: [],
      leaveHistories: [],
      detailLeaveHistories: [],
      isLeaveDetailVisible: false,
      leaveId: '',
      tgl_berangkat: '',
      tgl_kembali: '',
      nrp: '',
      cuti_lapangan: '',
      cuti_tahunan: '',
      cuti_besar: '',
      cuti_istirahat: '',
      created_date: '',
      status: '',
      atasan_level: '',
      atasan_nama: '',
      atasan_nrp: '',
      leaveStatus: '',
      pesan: '',
      tanggal_approval: '',
    };
  }
  showLeaveDetail = () => {
    setTimeout(() => {
      this.setState({isLeaveDetailVisible: true});
    }, 500);
  };

  hideLeaveDetail = () => {
    this.setState({isLeaveDetailVisible: false});
  };

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    this.setState({loading: true}, this.getLeaveData);
  };

  refresh = () => {
    this.setState({refreshing: true});
    this.getLeaveData();
  };

  getLeaveData = () => {
    Axios.get(`/cuti/${this.context.userData.nrp}`)
      .then((res2) => {
        this.setState({
          loading: false,
          refreshing: false,
          requestError: false,
          leaveHistories: res2.data,
        });
      })
      .catch((e) => {
        this.setState({
          loading: false,
          refreshing: false,
          requestError: true,
        });
        alert('terjadi kesalahan: ' + e);
      });
  };

  getLeaveDetailData = (id) => {
    Axios.get(`/cutiDetail?id=${id}`)
      .then((res) => {
        this.setState({
          loading: false,
          refreshing: false,
          requestError: false,
          detailLeaveHistories: res.data.detail,
          leaveId: res.data.detail.id,
          tgl_berangkat: res.data.detail.tanggal_berangkat,
          tgl_kembali: res.data.detail.tanggal_kembali,
          nrp: res.data.detail.nrp,
          cuti_lapangan: res.data.detail.cuti_lapangan,
          cuti_tahunan: res.data.detail.cuti_tahunan,
          cuti_besar: res.data.detail.cuti_besar,
          cuti_istirahat: res.data.detail.cuti_istirahat,
          created_date: res.data.detail.created_date,
          status: res.data.detail.status,
        });
        // alert(JSON.stringify(res.data.detail));
        this.RBSheet.open();
      })
      .catch((e) => {
        this.setState({
          loading: false,
          refreshing: false,
          requestError: true,
        });
        alert('terjadi kesalahan: ' + e);
      });
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
        <SafeAreaView style={{flex: 1, height: safeAreaView_height}}>
          <Appbar.Header style={{zIndex: 3}}>
            <Appbar.BackAction
              onPress={() => this.props.navigation.replace('Home')}
            />
            <Appbar.Content title="Leave History" />
          </Appbar.Header>
          <View style={{flex: 1}}>
            {this.state.loading ? (
              <LoadingIndicator />
            ) : this.state.requestError ? (
              <ErrorData onRetry={this.getLeaveData} />
            ) : this.state.leaveHistories.length > 0 ? (
              <View
                style={{paddingHorizontal: 0}}
                showsVerticalScrollIndicator={true}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.refresh}
                  />
                }>
                <FlatList
                  data={this.state.leaveHistories}
                  scrollEnabled={true}
                  renderItem={({item, index}) => (
                    <List.Item
                      key={index}
                      description={`Tgl : ${item.tanggal_berangkat} s/d ${item.tanggal_kembali}`}
                      title={`${item.id}`}
                      right={(props) => (
                        <View style={styles.detailbutton}>
                          <TouchableOpacity
                            onPress={() => {
                              this.getLeaveDetailData(item.id);
                            }}>
                            {item.status === 'Confirmed' ||
                            item.status === 'Approved' ? (
                              <Text style={{color: 'white'}}>Detail</Text>
                            ) : (
                              <Text style={{color: 'grey'}}>Waiting</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={Divider}
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{alignItems: 'center'}}>
                  <Icons
                    name={'package-variant'}
                    size={50}
                    color={Colors.grey500}
                  />
                  <Caption
                    style={{
                      marginTop: 10,
                    }}>
                    Belum ada riwayat
                  </Caption>
                </View>
              </View>
            )}
            <View style={{alignSelf: 'flex-end'}}>
              <FAB
                style={{
                  margin: 25,
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                icon="plus"
                onPress={() =>
                  this.props.navigation.navigate('LeavingForm', {
                    onGoBack: () => this.reload(),
                  })
                }
              />
            </View>
          </View>
        </SafeAreaView>
        <RBSheet
          animationType={'fade'}
          closeOnDragDown
          height={height - safeAreaView_height}
          duration={200}
          onClose={() => this.hideLeaveDetail()}
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
          <View
            style={{
              width: width,
              paddingHorizontal: 20,
              marginTop: 50,
            }}>
            <View
              style={{
                width: width,
                height: 35,
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: '#F79F1F',
                marginBottom: 30,
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                  fontFamily: 'Fontisto',
                }}>
                Detail Histori Cuti
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={styles.judulItemCuti}>Nama </Text>
              <Text style={styles.itemCuti}>{this.context.userData.nama}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.judulItemCuti}>NRP </Text>
              <Text style={styles.itemCuti}>{this.state.nrp}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.judulItemCuti}>Leave ID </Text>
              <Text style={styles.itemCuti}>{this.state.leaveId}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.judulItemCuti}>Awal</Text>
              <Text style={styles.itemCuti}>{this.state.tgl_berangkat}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.judulItemCuti}>Akhir </Text>
              <Text style={styles.itemCuti}>{this.state.tgl_kembali}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{width: 150}} />
              <Text />
            </View>
            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{width: 150}}>Jum Hari Cuti</Text>
              <Text />
            </View> */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.judulItemCuti}>Lapangan </Text>
              <Text style={styles.itemCuti}>
                {this.state.cuti_lapangan} Hari
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.judulItemCuti}>Tahunan </Text>
              <Text style={styles.itemCuti}>
                {this.state.cuti_tahunan} Hari
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.judulItemCuti}>Besar </Text>
              <Text style={styles.itemCuti}>{this.state.cuti_besar} Hari</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.judulItemCuti}>Istirahat </Text>
              <Text style={styles.itemCuti}>
                {this.state.cuti_istirahat} Hari
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.judulItemCuti}>Tgl Dibuat </Text>
              <Text style={styles.itemCuti}>{this.state.created_date}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.judulItemCuti}>Status </Text>
              <Text style={styles.itemCuti}>{this.state.status}</Text>
            </View>
          </View>
        </RBSheet>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  detailbutton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0abde3',
  },
  judulItemCuti: {
    width: 100,
    fontSize: 14,
    // fontWeight: 'bold',
    fontFamily: 'Fontisto',
    color: '#2980b9',
  },
  itemCuti: {
    width: 200,
    fontWeight: 'normal',
    fontFamily: 'Fontisto',
  },
});
LeavingScreen.contextType = AppContext;
export default LeavingScreen;
