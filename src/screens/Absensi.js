import React, {Component, useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TextInput,
  Linking,
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

class Absensi extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listAbsensi: [],
      isLoading: true,
      isRequestError: false,
      isRevisionModalVisible: false,
      historyList: [],
      tgl_now: new Date().getTime(),
      tgl_revisi: new Date().getTime() + 1,
    };
  }

  componentDidMount() {
    this.getAbsensi();
    // alert(this.state.tgl_now);
  }

  openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  getAbsensi = () => {
    this.setState({
      isLoading: true,
    });
    Axios.get(`/absensi/${this.context.userData.nrp}`)
      .then((res) => {
        this.setState({
          isLoading: false,
          isRequestError: false,
          listAbsensi: res.data,
        });
        // alert(JSON.stringify(this.state.listAbsensi));
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

        <Appbar.Header style={{zIndex: 3}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Attendance Record" />
          <Appbar.Action
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
          />
        </Appbar.Header>
        <View
          style={{
            backgroundColor: '#0984e3',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              paddingLeft: 15,
              paddingVertical: 10,
              fontSize: 18,
              color: Colors.white,
              width: 70,
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
              width: 60,
              marginVertical: 1,
            }}>
            Roster
          </Text>

          <Text
            style={{
              paddingLeft: 5,
              paddingVertical: 10,
              fontSize: 18,
              color: Colors.white,
              width: 80,
              marginVertical: 1,
            }}>
            Checkin
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
            Checkout
          </Text>

          <Text
            style={{
              paddingLeft: 15,
              paddingVertical: 10,
              fontSize: 18,
              color: Colors.white,
              marginVertical: 1,
            }}>
            Peduli
          </Text>
        </View>

        <View style={{flex: 1}}>
          {this.state.isLoading ? (
            <LoadingIndicator />
          ) : this.state.isRequestError ? (
            <ErrorData onRetry={this.getAbsensi} />
          ) : !this.state.listAbsensi ? (
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
              data={this.state.listAbsensi}
              renderItem={({item}) => {
                const monthName = [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ];

                const date = new Date(item.tanggal);
                const formattedDate = `${
                  date.getDate() < 10 ? '0' : ''
                }${date.getDate()} ${monthName[date.getMonth()]}`;
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
                        fontSize: 15,
                        paddingLeft: 20,
                        paddingVertical: 5,
                        color: Colors.grey700,
                        backgroundColor: 'transparent',
                        width: 90,
                      }}>
                      {formattedDate || '-'}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingHorizontal: 0,
                        paddingVertical: 5,
                        color: Colors.grey700,
                        backgroundColor: 'transparent',
                        width: 50,
                      }}>
                      {item.kode || '-'}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingHorizontal: 0,
                        paddingVertical: 5,
                        alignSelf: 'center',
                        color: Colors.grey700,
                        backgroundColor: 'transparent',
                        width: 90,
                      }}>
                      {item.masuk || '-'}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingHorizontal: 0,
                        paddingVertical: 5,
                        alignSelf: 'center',
                        color: Colors.grey700,
                        backgroundColor: 'transparent',
                        width: 115,
                      }}>
                      {item.keluar || '-'}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingHorizontal: 0,
                        paddingVertical: 5,
                        alignSelf: 'center',
                        color: Colors.grey700,
                        backgroundColor: 'transparent',
                        flex: 1,
                      }}>
                      {item.sp || '-'}
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
          icon="pencil"
          size={20}
          onPress={() => this.setState({isRevisionModalVisible: true})}
        />

        <AttendanceRevision
          isVisible={this.state.isRevisionModalVisible}
          onHide={() => this.setState({isRevisionModalVisible: false})}
        />
      </>
    );
  }
}

const AttendanceRevision = ({isVisible = false, onHide}) => {
  const [date, setDate] = useState(new Date());
  const [revDate, setRevDate] = useState(new Date().getTime());
  const [curDate, setCurDate] = useState(new Date().getTime());

  const [timein, setTimeIn] = useState(new Date());
  const [timeout, setTimeOut] = useState(new Date());
  const [haswh, setHasWh] = useState('0');

  const getTanggal = (tanggal) => {
    // let tanggal = new Date();
    return `${tanggal.getFullYear()}-${tanggal.getMonth() + 1 < 10 ? '0' : ''}${
      tanggal.getMonth() + 1
    }-${tanggal.getDate() < 10 ? '0' : ''}${tanggal.getDate()}`;
  };

  const getWaktu = (tanggal) => {
    var datetext = tanggal.toTimeString();
    datetext = datetext.split(' ')[0];
    datetext = datetext.slice(0, 5);
    return `${datetext}`;
  };

  const stringTimeToDate = (timeString) => {
    const formatedTime = new Date(Date.parse(`01/01/1970 ${timeString}`));
    console.log(formatedTime);
    return formatedTime;
  };

  //==================== BATAS MODAL PICKER =========
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimeInPickerVisible, setTimeInPickerVisibility] = useState(false);
  const [isTimeOutPickerVisible, setTimeOutPickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showTimeInPicker = () => {
    setTimeInPickerVisibility(true);
  };
  const showTimeOutPicker = () => {
    setTimeOutPickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimeInPicker = () => {
    setTimeInPickerVisibility(false);
  };
  const hideTimeOutPicker = () => {
    setTimeOutPickerVisibility(false);
  };

  const dateConfirm = (date) => {
    // console.warn('A date has been picked: ', date);
    // new Date().getTime()
    // alert(date.getTime());
    setDate(date);
    setRevDate(date);
    setCurDate(new Date());
    // if (curDate < revDate) {
    //   alert('Tanggal tidak valid !!');
    //   hideDatePicker();
    // } else {
    getTimeInOut(getTanggal(date));
    hideDatePicker();
    // }
  };
  const timeInConfirm = (date) => {
    // console.warn('A date has been picked: ', date);
    setTimeIn(date);
    hideTimeInPicker();
  };
  const timeOutConfirm = (date) => {
    // console.warn('A date has been picked: ', date);
    setTimeOut(date);
    hideTimeOutPicker();
  };

  const [reasonId, setReasonId] = useState(null);
  const [reasonOption, setReasonOption] = useState([]);
  const [remark, setRemark] = useState('');
  const [isReasonLoading, setIsReasonLoading] = useState(true);
  const [isKirimLoading, setIsKirimLoading] = useState(false);
  const context = useContext(AppContext);

  useEffect(() => {
    getReasonData();
  }, []);

  // const resetState = () => {
  //   setDate(new Date());
  //   setTimeIn(new Date());
  //   setTimeOut(new Date());
  //   setReasonId(null);
  //   setRemark('');
  // };

  const hide = () => {
    onHide();
    // resetState();
  };

  const getReasonData = () => {
    setIsReasonLoading(true);

    Axios.get('/revisiAbsenForm')
      .then((res) => {
        // alert(JSON.stringify(res.data))
        const formattedReason = res.data.reason.map((item, index) => ({
          id: index,
          code: item.id,
          name: item.reason,
          tglNow: item.tgl_sekarang,
        }));
        setIsReasonLoading(false);
        setReasonOption(formattedReason);
      })
      .catch((error) => {
        setIsReasonLoading(false);
        setReasonId(null);
        // alert("Reason Error: " + error);
      });
  };

  const handleKirim = () => {
    // alert(getWaktu(timein));
    if (
      !date ||
      !timein ||
      !timeout ||
      !remark ||
      haswh === '0' ||
      curDate < revDate
    ) {
      Alert.alert(
        'Isian tidak lengkap',
        'atau tanggal tidak valid !!',
        [
          {
            text: 'OK',
            onPress: () => null,
          },
        ],
        {onDismiss: () => null},
      );
    } else {
      setIsKirimLoading(true);

      Axios.post('/revisiAbsen', {
        nrp: context.userData.nrp,
        tanggal: getTanggal(date),
        in: getWaktu(timein),
        out: getWaktu(timeout),
        reason: reasonOption[reasonId].code,
        remark: remark,
      })
        .then((response) => {
          setIsKirimLoading(false);

          Alert.alert(
            'Success',
            `${response.data.message}`,
            [
              {
                text: 'OK',
                onPress: hide,
              },
            ],
            {onDismiss: hide},
          );
          this.getAbsensi();
        })
        .catch((error) => {
          setIsKirimLoading(false);

          // Alert.alert(
          //   'Oops .. Terjadi Kesalahan !!',
          //   JSON.stringify(error),
          //   [
          //     {
          //       text: 'OK',
          //       onPress: () => null,
          //     },
          //   ],
          //   {onDismiss: () => null},
          // );
        });
    }
  };

  const getTimeInOut = (tanggal) => {
    Axios.get(`/absInOut/${context.userData.nrp}/${tanggal}`).then((res) => {
      if (res.data.masuk == null && res.data.keluar == null) {
        setTimeIn(new Date());
        setTimeOut(new Date());
        setHasWh(res.data.has_wh);
      } else if (res.data.masuk == null) {
        setTimeIn(new Date());
        setTimeOut(stringTimeToDate(res.data.keluar));
        setHasWh(res.data.has_wh);
      } else if (res.data.keluar == null) {
        setTimeOut(new Date());
        setTimeIn(stringTimeToDate(res.data.masuk));
        setHasWh(res.data.has_wh);
      } else {
        setTimeIn(stringTimeToDate(res.data.masuk));
        setTimeOut(stringTimeToDate(res.data.keluar));
        setHasWh(res.data.has_wh);
      }
    });
  };

  return (
    <Modal
      onBackdropPress={hide}
      onBackButtonPress={hide}
      isVisible={isVisible}
      // backdropColor={Colors.white}
      backdropOpacity={0.3}>
      <SafeAreaView>
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 10,
            elevation: 7,
            width: width,
            alignSelf: 'center',
            marginVertical: 20,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 100, alignItems: 'center'}}>
              <IconButton
                style={{marginLeft: 0}}
                icon={({size, color}) => (
                  <Icons name="chevron-left" size={size} color={'grey'} />
                )}
                color={Colors.black}
                size={25}
                onPress={hide}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-start',
                height: 40,
                // paddingLeft: 20,
              }}>
              <Title style={styles.huruf}>Attendance Revision</Title>
            </View>
          </View>
          <Divider />
          <ScrollView>
            <View
              style={{
                marginVertical: 50,
                borderRightWidth: 0.5,
                borderRadius: 20,
              }}>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  {context.userData.nama}
                </Text>
                <Text>{context.userData.nrp}</Text>
              </View>
              <View style={{marginTop: 50}}>
                <Text
                  style={{marginTop: 20, marginBottom: 5, alignSelf: 'center'}}>
                  Tanggal Kehadiran:
                </Text>
              </View>
              <View>
                <Button
                  onPress={showDatePicker}
                  mode="contained"
                  color={Colors.transparent}
                  style={styles.timewrapper}
                  loading={isKirimLoading}>
                  {getTanggal(date)}
                </Button>
              </View>
              <View style={{height: 10}} />
              <View>
                <View>
                  <Text style={{marginTop: 10, alignSelf: 'center'}}>
                    Jam Masuk:
                  </Text>
                </View>
                <Button
                  onPress={showTimeInPicker}
                  mode="contained"
                  color={Colors.transparent}
                  style={styles.timewrapper}
                  loading={isKirimLoading}>
                  {getWaktu(timein)}
                </Button>
                <View style={{height: 10}} />
                <View>
                  <Text style={{marginTop: 10, alignSelf: 'center'}}>
                    Jam Pulang:
                  </Text>
                </View>
                <Button
                  onPress={showTimeOutPicker}
                  mode="contained"
                  color={Colors.transparent}
                  style={styles.timewrapper}
                  loading={isKirimLoading}>
                  {getWaktu(timeout)}
                </Button>
              </View>
              {/* )} */}

              {/* <Button title={getWaktu(timeout)} onPress={showTimeOutPicker} /> */}
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={dateConfirm}
                onCancel={hideDatePicker}
              />
              <DateTimePickerModal
                isVisible={isTimeInPickerVisible}
                mode="time"
                is24Hour={true}
                onConfirm={timeInConfirm}
                onCancel={hideTimeInPicker}
              />
              <DateTimePickerModal
                isVisible={isTimeOutPickerVisible}
                mode="time"
                is24Hour={true}
                onConfirm={timeOutConfirm}
                onCancel={hideTimeOutPicker}
              />
              <View />
              <View style={{width: width - h_margin * 2, alignSelf: 'center'}}>
                <InputOption
                  label="Alasan"
                  mode="contained"
                  value={reasonId != null && reasonOption[reasonId].name}
                  optionData={reasonOption}
                  useIndexReturn={true}
                  onOptionChoose={(val) => setReasonId(val)}
                  hasHelper={false}
                  style={{
                    height: 50,
                    marginBottom: 5,
                    marginTop: 20,
                    borderColor: 'transparent',
                  }}
                  isLoading={isReasonLoading}
                />
              </View>
              <View style={{width: width - h_margin * 6, alignSelf: 'center'}}>
                <TextInput
                  mode="outline"
                  style={{
                    backgroundColor: 'transparent',
                    marginBottom: 30,
                    fontSize: 15,
                    color: '#576574',
                    // paddingHorizontal: 20,
                    // marginHorizontal: h_margin,
                    // width: width - h_margin * 2,
                  }}
                  // label="Remark"
                  // value={remark}
                  onChangeText={(text) => setRemark(text)}
                  placeholder="Penjelasan Alasan"
                />
              </View>
              {reasonId !== null && remark !== '' ? (
                <Button
                  onPress={handleKirim}
                  mode="contained"
                  color={'#F79F1F'}
                  // backgroundColor={'#F79F1F'}
                  style={styles.tombolkirim}
                  loading={isKirimLoading}>
                  Kirim Revisi
                </Button>
              ) : (
                <View />
              )}
            </View>
            <View style={{height: 300}} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 20,
    right: 20,
    bottom: 0,
  },
  judul: {
    backgroundColor: Colors.grey300,
    color: 'white',
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  huruf: {
    color: Colors.grey500,
    justifyContent: 'center',
    textAlign: 'center',
  },
  isi: {
    fontSize: 15,
    paddingHorizontal: 0,
    paddingVertical: 5,
    alignSelf: 'center',
    flex: 1,
  },
  timewrapper: {
    width: 200,
    elevation: 0,
    marginTop: 5,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'orange',
    alignSelf: 'center',
    color: 'blue',
    fontSize: 20,
    height: 40,
    justifyContent: 'center',
  },
  tombolkirim: {
    height: 50,
    width: 300,
    elevation: 0,
    marginTop: 5,
    borderRadius: 25,
    borderWidth: 0.5,
    // borderColor: '#F79F1F',
    // backgroundColor: '#F79F1F',
    // color: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 18,
  },
});

Absensi.contextType = AppContext;
export default Absensi;
