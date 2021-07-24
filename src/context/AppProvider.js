import React, {Component} from 'react';
import {AppContext} from '../context';
import {Text, View, Alert} from 'react-native';
// import DeviceInfo from "react-native-device-info";
// import API from "../api";
import axios from 'axios';
import {site} from '../constants';

export default class AppProvider extends Component {
  state = {
    isLoggedIn: null,
    isOperate: false,
    screen: {title: 'Employee', subtitle: null},
    userData: {
      nrp: '',
      nama: '',
      dept: '',
      jabatan: '',
      posisi: '',
      sub_empl: '',
      tgl_lahir: '',
      marital_stat: '',
      email: '',
      no_hp: '',
      npwp: '',
      gol_darah: '',
      bpjs_ks: '',
      bpjs_tk: '',
      exp_mcu: '',
      valid_simper: '',
      valid_simpol: '',
      valid_permit: '',
      simpol: [],
      keluarga: [],
    },

    checkInHistory: [],

    mac: '00:00:00:00',
    emplphoto: null,

    status: {
      isCheckedIn: false,
      unit: 'PPA05',
      roster: null,
      isNonOpr: null,
      hasLoader: null,
      hasParkingLocation: null,
      loader: null,
      parkingLocation: null,
      hmStart: null,
      hmStop: null,
      lastHm: null,
      lastParkingLocation: null,
      activity: null,
    },

    app_version: '7.5',
    siteId: null,
    claimId: null,
    isPublicNetwork: false,

    isLoading: false,
    lastParkingLocationDialogVisible: false,
    volume: null,
  };

  setOperate = (isOperate) => {
    this.state({isOperate: isOperate});
  };

  setLoggedIn = (isLoggedIn) => {
    // console.log(isLoggedIn);
    this.setState({
      isLoggedIn: isLoggedIn,
    });
  };

  setScreen = (title, subtitle = null) => {
    this.setState({
      screen: {title: title, subtitle: subtitle},
    });
  };
  setUserData = (
    nrp,
    nama,
    dept,
    jabatan,
    posisi,
    sub_empl,
    tgl_lahir,
    marital_stat,
    email,
    no_hp,
    npwp,
    gol_darah,
    bpjs_ks,
    bpjs_tk,
    exp_mcu,
    valid_simper,
    valid_simpol,
    valid_permit,
    simpol,
    keluarga,
  ) => {
    this.setState({
      userData: {
        nrp,
        nama,
        dept,
        jabatan,
        posisi,
        sub_empl,
        tgl_lahir,
        marital_stat,
        email,
        no_hp,
        npwp,
        gol_darah,
        bpjs_ks,
        bpjs_tk,
        exp_mcu,
        valid_simper,
        valid_simpol,
        valid_permit,
        simpol,
        keluarga,
      },
    });
    // alert(this.state.userData.tgl_lahir);
  };

  clearUserData = () => {
    this.setState({
      userData: {
        nrp: '',
        nama: '',
        dept: '',
        jabatan: '',
        posisi: '',
        sub_empl: '',
        tgl_lahir: '',
        marital_stat: '',
        gol_darah: '',
        exp_mcu: '',
        valid_simper: '',
        valid_simpol: '',
        valid_permit: '',
        simpol: [],
        keluarga: [],
      },
    });
  };

  checkIn = (unit, callback) => {
    callback();
    this.setLoading(true);
    axios
      .post('/checkIn', {
        nrp: this.state.userData.nrp,
        unit: unit,
        mac: this.state.mac,
      })
      .then((response) => {
        this.getStatus();
        this.updateCheckInHistory();
        this.setLoading(false);
        Alert.alert(
          response.data.message,
          response.data.message,
          [
            {
              text: 'OK',
              onPress: () =>
                this.state.status.isNonOpr === true
                  ? null
                  : this.setLastParkingLocationDialogVisible(true),
            },
          ],
          {
            onDismiss: () =>
              this.state.status.isNonOpr == true
                ? null
                : this.setLastParkingLocationDialogVisible(true),
          },
        );
      })
      .catch((error) => {
        this.setLoading(false);
        Alert.alert(
          'Check In Gagal',
          error.response.data.status == 400
            ? error.response.data.message
            : 'Terjadi kesalahan',
          [{text: 'OK', onPress: () => null}],
          {cancelable: false},
        );
      });
  };

  checkInDev = (unit, callback) => {
    callback();
    this.setLoading(true);

    var data = new FormData();
    data.append('nrp', this.state.userData.nrp);
    data.append('unit', unit);
    data.append('mac', this.state.mac);
    data.append('face', {
      uri: this.state.emplphoto.path,
      type: this.state.emplphoto.mime,
      name: 'image.jpg',
    });

    axios
      .post('/checkin', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        this.getStatus();
        this.updateCheckInHistory();
        this.setLoading(false);
        Alert.alert(
          response.data.message,
          response.data.message,
          [
            {
              text: 'OK',
              onPress: () =>
                this.state.status.isNonOpr === true
                  ? null
                  : this.setLastParkingLocationDialogVisible(true),
            },
          ],
          {
            onDismiss: () =>
              this.state.status.isNonOpr == true
                ? null
                : this.setLastParkingLocationDialogVisible(true),
          },
        );
      })
      .catch((error) => {
        this.setLoading(false);
        Alert.alert(
          'Check In Gagal',
          error.response.data.status == 400
            ? error.response.data.message
            : 'Terjadi kesalahan',
          [{text: 'OK', onPress: () => null}],
          {cancelable: false},
        );
      });
  };

  checkOut = () => {
    this.setLoading(true);
    axios
      .post('/checkOut', {
        nrp: this.state.userData.nrp,
        unit: this.state.status.unit,
      })
      .then((response) => {
        this.setLoading(false);
        this.setState({checkedIn: false});
        Alert.alert(response.data.message, response.data.message);
        this.getStatus();
        this.updateCheckInHistory();
      })
      .catch((error) => {
        this.setLoading(false);
        alert(error);
      });
  };

  updateCheckInHistory = () => {
    axios
      .get(`/history/${this.state.userData.nrp}`)
      .then((response) => {
        this.setState({checkInHistory: response.data});
      })
      .catch((error) => {
        alert(error);
      });
  };

  dateNow() {
    let today = new Date();
    let dd = today.getDate();

    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = `0${dd}`;
    }

    if (mm < 10) {
      mm = `0${mm}`;
    }

    today = `${dd}/${mm}/${yyyy}`;
    return today;
  }

  timeNow() {
    var today = new Date();
    var time = today.getHours() + ':' + today.getMinutes();
    return time;
  }

  // setMAC = () => {
  //   DeviceInfo.getMACAddress().then((mac) => {
  //     // "E5:12:D8:E5:69:97"
  //     this.setState({ mac });
  //   });
  // };

  setSite = (siteId) => {
    this.setState({siteId});
  };

  setApp_Version = (app_version) => {
    this.setState({app_version});
  };

  setClaim = (claimId) => {
    this.setState({claimId});
  };

  setNetwork = (isPublic) => {
    this.setState({isPublicNetwork: isPublic});
  };

  setBaseUrl = (siteId, isPublicNetwork) => {
    axios.defaults.baseURL = `${
      site[siteId].apiUrl[isPublicNetwork ? 'public' : 'local']
    }/api/cico`;
  };

  getStatus = () => {
    axios
      .get(`/status/${this.state.userData.nrp}`)
      .then((response) => {
        // const isCheckedIn = response.data.isCheckedIn;
        // const unit = isCheckedIn == true ? response.data.unit : "";

        if (response.data.isCheckedIn) {
          this.setState({
            status: {
              isCheckedIn: response.data.isCheckedIn,
              unit: response.data.unit,
              roster: response.data.roster,
              isNonOpr:
                response.data.unit === 'Non Opr' ||
                response.data.unit === 'STB' ||
                response.data.unit === 'Training'
                  ? true
                  : false,
              hasLoader: response.data.hasLoader,
              hasParkingLocation: response.data.hasParkingLocation,
              loader: response.data.loader,
              parkingLocation: response.data.parkingLocation,
              hmStart: response.data.hmStart,
              hmStop: response.data.hmStop,
              lastHm: response.data.lastHm,
              lastParkingLocation: response.data.lastParkingLocation,
              activity: response.data.activity,
            },
            // },()=>alert("Last Parking :" + this.state.status.lastParkingLocation + "  Activity : " + this.state.status.activity + "Last HM : " + this.state.status.lastHm + " HM Start: " + this.state.status.hmStart + "HM Stop " + this.state.status.hmStop  ));
          });
        } else {
          this.setState({
            status: {
              isCheckedIn: response.data.isCheckedIn,
              unit: null,
              roster: null,
              isNonOpr: null,
              hasLoader: null,
              hasParkingLocation: null,
              loader: null,
              parkingLocation: null,
              hmStart: null,
              hmStop: null,
              lastHm: null,
              lastParkingLocation: null,
              activity: null,
            },
          });
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  setLoading = (isLoading) => {
    this.setState({isLoading});
  };

  // setApprovalUpdate = (isApprovalUpdate) => {
  //   this.setState({isApprovalUpdate});
  // };

  setLastParkingLocationDialogVisible = (isVisible) => {
    this.setState({
      lastParkingLocationDialogVisible: isVisible,
    });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          // isApprovalUpdate: this.state.isApprovalUpdate,
          isLoggedIn: this.state.isLoggedIn,
          isOperate: this.state.isOperate,
          screen: this.state.screen,
          userData: this.state.userData,
          checkInHistory: this.state.checkInHistory,
          status: this.state.status,
          mac: this.state.mac,
          siteId: this.state.siteId,
          app_version: this.state.app_version,
          claimId: this.state.claimId,
          isLoading: this.state.isLoading,
          lastParkingLocationDialogVisible: this.state
            .lastParkingLocationDialogVisible,
          isPublicNetwork: this.state.isPublicNetwork,
          // setApprovalUpdate: this.setApprovalUpdate,
          setLoggedIn: this.setLoggedIn,
          setScreen: this.setScreen,
          setUserData: this.setUserData,
          clearUserData: this.clearUserData,
          checkIn: this.checkIn,
          checkInDev: this.checkInDev,
          checkOut: this.checkOut,
          updateCheckInHistory: this.updateCheckInHistory,
          // setMAC: this.setMAC,
          setSite: this.setSite,
          getStatus: this.getStatus,
          setLoading: this.setLoading,
          dateNow: this.dateNow,
          timeNow: this.timeNow,
          setLastParkingLocationDialogVisible: this
            .setLastParkingLocationDialogVisible,
          setNetwork: this.setNetwork,
          setBaseUrl: this.setBaseUrl,
          setPhoto: this.setPhoto,
          volume: this.volume,
        }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
