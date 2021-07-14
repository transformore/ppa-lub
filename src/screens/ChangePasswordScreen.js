import {
  View,
  StatusBar,
  TouchableNativeFeedback,
  Keyboard,
  Alert,
  Dimensions,
} from 'react-native';

import React, {Component, useContext, useState, useEffect} from 'react';
import {Colors, TextInput, Title} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';
import {AppContext} from '../context';

export class ChangePasswordScreen extends Component {
  _home = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
    return <ChangePassword {...this.props} />;
  }
}
export default ChangePasswordScreen;

const ChangePassword = ({navigation}) => {
  const context = useContext(AppContext);

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const backHome = () => {
    navigation.navigate('Home');
  };

  const handleSubmit = () => {
    let errMsg;

    if (oldPass == '' || newPass === '' || confirmPass === '') {
      errMsg = 'Lengkapi isian';
    } else if (newPass === confirmPass) {
      // if (errMsg != undefined) {
      //   Alert.alert(
      //     "Oops!",
      //     `${errMsg}`,
      //     [
      //       {
      //         text: "OK",
      //         onPress: () => null,
      //       },
      //     ],
      //     { onDismiss: () => null }
      //   );
      //   return;
      // }

      Keyboard.dismiss();
      context.setLoading(true);

      Axios.put('/changePassword', {
        nrp: context.userData.nrp,
        old_password: oldPass,
        new_password: newPass,
      })
        .then((res) => {
          if (res.data.status == 1) {
            // throw res.data;
            alert(res.data.message);
            navigation.goBack();
          } else {
            alert(res.data.message);
          }
        })

        .catch((error) => {
          Alert.alert(
            'Oops!',
            error.message ?? 'Something went wrong',
            [{text: 'OK', onPress: () => null}],
            {cancelable: false},
          );
        })
        .then(() => {
          context.setLoading(false);
        });
    } else {
      alert('Konfirmasi password tidak sesuai');
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={'transparent'}
        translucent={false}
      />
      <View
        style={{
          backgroundColor: 'transparent',
          width: 370,
          alignSelf: 'center',
        }}>
        <View
          style={{
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
          }}>
          <Icons name={'lock-open'} size={40} color={'grey'} />
        </View>

        <View
          style={{
            padding: 40,
            backgroundColor: Colors.grey100,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            elevation: 10,
          }}>
          <TextInput
            // autoFocus={true}
            // mode="outlined"
            mode="contained"
            style={{
              marginBottom: 7,
              // backgroundColor: '#C4E538',
              backgroundColor: 'transparent',
              color: '#747d8c',
            }}
            label="Old Password"
            placeholder="Isikan password lama anda"
            secureTextEntry={true}
            value={oldPass}
            onChangeText={(text) => setOldPass(text)}
          />
          <TextInput
            // mode="outlined"
            mode="contained"
            style={{
              marginBottom: 7,
              backgroundColor: 'transparent',
              color: '#747d8c',
            }}
            label="New Password"
            placeholder=" Masukkan password baru anda"
            secureTextEntry={true}
            value={newPass}
            onChangeText={(text) => setNewPass(text)}
          />
          <TextInput
            mode="contained"
            style={{
              marginBottom: 15,
              // backgroundColor: '#C4E538',
              backgroundColor: 'transparent',
              color: '#747d8c',
            }}
            label="Confirm New Password"
            placeholder=" Konfirmasi password baru anda"
            secureTextEntry={true}
            value={confirmPass}
            onChangeText={(text) => setConfirmPass(text)}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableNativeFeedback onPress={handleSubmit}>
              <View
                style={{
                  height: 50,
                  width: 130,
                  marginRight: 10,
                  marginTop: 30,
                  backgroundColor: '#FFA41B',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 25,
                }}>
                <Title style={{color: Colors.white}}>Submit</Title>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={backHome}>
              <View
                style={{
                  marginLeft: 10,
                  marginTop: 30,
                  height: 50,
                  width: 130,
                  backgroundColor: '#FFA41B',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 25,
                }}>
                <Title style={{color: Colors.white}}>Cancel</Title>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    </>
  );
};
