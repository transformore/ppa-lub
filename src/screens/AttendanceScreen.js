import React, {Component, useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Colors,
  Appbar,
  Caption,
  Divider,
  FAB,
  TextInput,
  Title,
  IconButton,
  Button,
  // Card,
} from 'react-native-paper';
import Axios from 'axios';
import {
  LoadingIndicator,
  ErrorData,
  InputOption,
  // TimePicker,
} from '../components';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import {AppContext} from '../context';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
// import {FormatingDate} from '../utils';
// import DatePicker from 'react-native-datepicker';

class AttendanceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listAbsensi: [],
      isLoading: true,
      isRequestError: false,
      isRevisionModalVisible: false,
    };
  }

  componentDidMount() {
    this.getAbsensi();
  }

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
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingLeft: 20,
                        paddingVertical: 5,
                        color: Colors.grey700,
                        backgroundColor:
                          item.rev_status === '0'
                            ? Colors.yellow100
                            : item.rev_status === '1'
                            ? Colors.grey200
                            : item.rev_status === '2'
                            ? Colors.red100
                            : Colors.grey100,
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
                        backgroundColor:
                          item.rev_status === '0'
                            ? Colors.yellow100
                            : item.rev_status === '1'
                            ? Colors.grey200
                            : item.rev_status === '2'
                            ? Colors.red100
                            : Colors.grey100,
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
                        backgroundColor:
                          item.rev_status === '0'
                            ? Colors.yellow100
                            : item.rev_status === '1'
                            ? Colors.grey200
                            : item.rev_status === '2'
                            ? Colors.red100
                            : Colors.grey100,
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
                        backgroundColor:
                          item.rev_status === '0'
                            ? Colors.yellow100
                            : item.rev_status === '1'
                            ? Colors.grey200
                            : item.rev_status === '2'
                            ? Colors.red100
                            : Colors.grey100,
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
                        backgroundColor:
                          item.rev_status === '0'
                            ? Colors.yellow100
                            : item.rev_status === '1'
                            ? Colors.grey200
                            : item.rev_status === '2'
                            ? Colors.red100
                            : Colors.grey100,
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
  const [dateShow, setDateShow] = useState(false);

  const [timein, setTimeIn] = useState(new Date());
  // const [time, setTime] = useState(new Date());
  const [timeout, setTimeOut] = useState(new Date());
  // const [timeShow, setTimeShow] = useState(false);
  const [timeinShow, setTimeInShow] = useState(false);
  const [timeoutShow, setTimeOutShow] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDateShow(Platform.OS === 'ios');
    setDate(currentDate);
    setDateShow === false;
    getTimeInOut(getTanggal(currentDate));
  };
  const onChangeTimeIn = (event, selectedTime) => {
    const currentTime = selectedTime || timein;
    setTimeInShow(Platform.OS === 'ios');
    setTimeIn(currentTime);
    // console.log(getWaktu(currentTime));
  };
  const onChangeTimeOut = (event, selectedTime) => {
    const currentTime = selectedTime || timeout;
    setTimeOutShow(Platform.OS === 'ios');
    setTimeOut(currentTime);
    // console.log(getWaktu(currentTime));
  };

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

    Axios.get(`/revisiAbsenForm`)
      .then((res) => {
        const formattedReason = res.data.reason.map((item, index) => ({
          id: index,
          code: item.id,
          name: item.reason,
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
    if (!date || !timein || !timeout || reasonId == null || !remark) {
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
      setIsKirimLoading(true);

      Axios.post(`/revisiAbsen`, {
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
        })
        .catch((error) => {
          setIsKirimLoading(false);

          Alert.alert(
            'Oops!',
            JSON.stringify(error),
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

  const getTimeInOut = (tanggal) => {
    // Axios.get(`/absInOut/${context.userData.nrp}/${tanggal}`).then((res) => {
    Axios.get(`/absInOut/${context.userData.nrp}/${tanggal}`).then((res) => {
      if (res.data.masuk == null && res.data.keluar == null) {
        setTimeIn(new Date());
        setTimeOut(new Date());
      } else if (res.data.masuk == null) {
        setTimeIn(new Date());
        setTimeOut(stringTimeToDate(res.data.keluar));
      } else if (res.data.keluar == null) {
        setTimeOut(new Date());
        setTimeIn(stringTimeToDate(res.data.masuk));
      } else {
        setTimeIn(stringTimeToDate(res.data.masuk));
        setTimeOut(stringTimeToDate(res.data.keluar));
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
      <View
        style={{
          backgroundColor: Colors.white,
          borderRadius: 10,
          elevation: 7,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              height: 50,
              paddingLeft: 20,
            }}>
            <Title style={styles.huruf}>Pengajuan Revisi Kehadiran</Title>
          </View>
          <IconButton
            style={{margin: 15}}
            icon={({size, color}) => (
              <Icons name="close" size={size} color={'teal'} />
            )}
            color={Colors.black}
            size={25}
            onPress={hide}
          />
        </View>
        <Divider />
        <View style={{padding: 15, borderRightWidth: 0.5, borderRadius: 20}}>
          <View pointerEvents="none">
            <TextInput
              mode="contained"
              style={{marginBottom: 10, backgroundColor: 'transparent'}}
              label=""
              value={`${context.userData.nrp} - ${context.userData.nama}`}
            />
          </View>
          <View>
            <Text style={{marginTop: 10, alignSelf: 'center'}}>
              Tanggal Kehadiran:
            </Text>
          </View>
          <View>
            <Button
              onPress={() => setDateShow(true)}
              mode="contained"
              color={Colors.transparent}
              style={styles.timewrapper}
              loading={isKirimLoading}>
              {getTanggal(date)}
            </Button>
            <View style={{height: 20}} />
            <View>
              <Text style={{marginTop: 10, alignSelf: 'center'}}>
                Waktu Masuk:
              </Text>
            </View>
            <Button
              // onPress={() => setTime(stringTimeToDate('07:00'))}
              onPress={() => setTimeInShow(true)}
              mode="contained"
              color={Colors.transparent}
              style={styles.timewrapper}
              loading={isKirimLoading}>
              {getWaktu(timein)}
            </Button>
            <View style={{height: 10}} />
            <Text style={{marginTop: 10, alignSelf: 'center'}}>
              Waktu Keluar :
            </Text>
            <Button
              onPress={() => setTimeOutShow(true)}
              mode="contained"
              color={Colors.transparent}
              style={styles.timewrapper}
              loading={isKirimLoading}>
              {getWaktu(timeout)}
            </Button>
          </View>
          {dateShow && (
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          )}
          {timeinShow && (
            <DateTimePicker
              testID="timePicker"
              value={timein}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeTimeIn}
            />
          )}
          {timeoutShow && (
            <DateTimePicker
              testID="timePicker"
              value={timein}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeTimeOut}
            />
          )}

          <InputOption
            label="Reason"
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

          <TextInput
            // mode="outlined"
            mode="contained"
            style={{marginBottom: 10, backgroundColor: 'transparent'}}
            label="Remark"
            value={remark}
            onChangeText={(text) => setRemark(text)}
          />

          <Button
            onPress={handleKirim}
            mode="contained"
            color={Colors.orange500}
            style={{
              elevation: 0,
              borderRadius: 15,
              marginHorizontal: 15,
              height: 40,
            }}
            loading={isKirimLoading}>
            Kirim
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
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
    color: Colors.grey700,
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
    elevation: 0,
    marginTop: 5,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: 'orange',
  },
});

AttendanceScreen.contextType = AppContext;
export default AttendanceScreen;
