import React, {Component, useContext, useState, useEffect} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Alert,
  Keyboard,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Colors, Divider, Title, IconButton, Button} from 'react-native-paper';
import Axios from 'axios';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppContext} from '../context';
import Modal from 'react-native-modal';
import {LoadingIndicator, ErrorData, InputOption} from '../components';
// import {FlatList} from 'react-native-gesture-handler';
// import DatePicker from 'react-native-datepicker';
const {width, height} = Dimensions.get('screen');
const h_margin = 15;

class HmStartDialog extends Component {
  render() {
    return (
      <Dialog isVisible={this.props.isVisible} onHide={this.props.onHide} />
    );
  }
}

HmStartDialog.contextType = AppContext;
export default HmStartDialog;

const Dialog = ({isVisible = false, onHide}) => {
  const context = useContext(AppContext);
  const [activityId, setActivityId] = useState();
  const [activityOption, setActivityOption] = useState([]);
  const [subActivityId, setSubActivityId] = useState(null);
  const [subActivityOption, setSubActivityOption] = useState([]);
  const [hmStart, setHmStart] = useState('');
  const [isActivityLoading, setIsActivityLoading] = useState(true);
  const [isSubActivityLoading, setIsSubActivityLoading] = useState(true);
  const [isKirimLoading, setIsKirimLoading] = useState(false);
  // const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);

  useEffect(() => {
    getActivityData();
  }, [isVisible]);

  const resetState = () => {
    setActivityId(null);
    setSubActivityId(null);
    setActivityOption([]);
    setSubActivityOption([]);
    setHmStart('');
  };

  const hide = () => {
    onHide();
    resetState();
  };

  const getActivityData = () => {
    setIsActivityLoading(true);
    Axios.get('/abcActivity')
      .then((res) => {
        const formattedActivity = res.data.map((item, index) => ({
          id: index,
          code: item.activity,
          name: item.activity,
        }));

        setIsActivityLoading(false);
        setActivityOption(formattedActivity);
        // alert(JSON.stringify(activityOption));
      })
      .catch((error) => {
        setIsActivityLoading(false);
        setActivityId(null);
        // alert("Reason Error: " + error);
      });
  };

  const getSubActivityData = (activity) => {
    setIsSubActivityLoading(true);
    Axios.get(`/abcActivitySub?activity=${activity}`)
      .then((res) => {
        const formattedSubActivity = res.data.map((item, index) => ({
          id: index,
          code: item.id,
          name: item.sub,
        }));

        setIsSubActivityLoading(false);
        setSubActivityOption(formattedSubActivity);
      })
      .catch((error) => {
        setIsSubActivityLoading(false);
        setSubActivityId(null);
        // alert("Reason Error: " + error);
      });
  };

  const handleSetActivity = (id) => {
    setActivityId(id);
    setSubActivityId(null);
    getSubActivityData(activityOption[id].code);
  };

  const handleKirim = () => {
    if (activityId == null || subActivityId == null || hmStart == null) {
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
    } else if (
      subActivityOption[subActivityId].code.substring(2, 4) === '10' &&
      (+hmStart < +context.status.lastHm ||
        +hmStart - +context.status.lastHm > 500)
    ) {
      alert(
        'Invalid KM !' + subActivityOption[subActivityId].code.substring(2, 4),
      );
    } else if (
      subActivityOption[subActivityId].code.substring(2, 4) !== '10' &&
      (+hmStart < +context.status.lastHm ||
        +hmStart - +context.status.lastHm > 20)
    ) {
      alert(
        'Invalid HM !' + subActivityOption[subActivityId].code.substring(2.4),
      );
    } else {
      hide();
      Keyboard.dismiss();
      // context.setLoading(true);
      // context.setLoading(false);
      Axios.put('/hmStart', {
        nrp: context.userData.nrp,
        unit: context.status.unit,
        hm: hmStart,
        activity: subActivityOption[subActivityId].code,
      })
        .then((response) => {
          if (response.data.kode === 1) {
            alert(
              'HM Start' + JSON.stringify(hmStart) + 'Data berhasil Disimpan !',
            );
          } else {
            alert(response.data.hasil);
          }

          if (response.data.kode == 1) {
            context.getStatus();
            // alert("HM Start di Dialog :" + context.status.hmStart );    // setIsSnackBarVisible(true);
          } else {
            // this.showSnackbar(response.data.hasil);
            alert(response.data.hasil);
          }
        })
        .catch((error) => {
          context.setLoading(false);
          Alert.alert(
            'Data gagal dikirim !',
            // "Terjadi kesalahan:" + error,
            'Terjadi kesalahan !! ',
            [{text: 'OK', onPress: () => null}],
            {cancelable: false},
          );
        });
    }
  };

  return (
    <>
      <Modal
        onBackdropPress={hide}
        onBackButtonPress={hide}
        isVisible={isVisible}
        backdropColor={Colors.white}
        backdropOpacity={0.85}>
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 10,
            elevation: 10,
            height: (height * 2) / 3,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                height: 50,
                paddingLeft: 20,
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Title style={{fontWeight: 'bold'}}>START OPERASI</Title>
            </View>
            <IconButton
              style={{marginBottom: 15, marginRight: 15}}
              icon={({size, color}) => (
                <Icons name="chevron-down" size={size} color={color} />
              )}
              color={Colors.black}
              size={25}
              onPress={hide}
            />
          </View>
          <Divider />
          <ScrollView style={{padding: 20}}>
            <View>
              <InputOption
                label="Activity"
                value={activityId != null && activityOption[activityId].name}
                optionData={activityOption}
                useIndexReturn={true}
                onOptionChoose={(val) => handleSetActivity(val)}
                hasHelper={false}
                style={{marginBottom: 10}}
                isLoading={isActivityLoading}
              />
            </View>
            {activityId != null && (
              <InputOption
                label="Sub Activity"
                value={
                  subActivityId != null && subActivityOption[subActivityId].name
                }
                optionData={subActivityOption}
                useIndexReturn={true}
                onOptionChoose={(val) => setSubActivityId(val)}
                hasHelper={false}
                style={{marginBottom: 10}}
                isLoading={isSubActivityLoading}
              />
            )}
            {subActivityId != null && (
              <View
                style={{
                  height: 50,
                  borderColor: 'black',
                  borderRadius: 25,
                  borderWidth: 1,
                  justifyContent: 'center',
                  paddingLeft: 25,
                  marginTop: 5,
                }}>
                <TextInput
                  selectionColor="red"
                  mode="contained"
                  keyboardType="numeric"
                  borderColor="transparent"
                  style={{fontSize: 18, fontWeight: 'bold'}}
                  // label="HM Start"
                  placeholder="HM Start "
                  placeholderTextColor="#7f8c8d"
                  value={hmStart}
                  onChangeText={(text) => setHmStart(text)}
                />
              </View>
            )}
            <View
              style={{
                backgroundColor: 'orange',
                height: 50,
                borderRadius: 25,
                justifyContent: 'center',
                marginTop: 50,
              }}>
              <Button
                onPress={handleKirim}
                mode="contained"
                borderRadius={25}
                height={50}
                color={'transparent'}
                // color={Colors.green600}
                style={{
                  elevation: 0,
                  borderRadius: 5,
                  justifyContent: 'center',
                  fontSize: 24,
                }}
                loading={isKirimLoading}>
                Kirim
              </Button>
            </View>
            <View style={{height: 500}} />
          </ScrollView>
        </View>
      </Modal>
      {/* <Snackbar
      visible={isSnackBarVisible}
      onDismiss={setIsSnackBarVisible(false)}
      duration={3000}
    >
      Sukses
    </Snackbar> */}
    </>
  );
};
