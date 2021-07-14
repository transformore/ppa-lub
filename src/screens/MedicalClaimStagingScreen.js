import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  TouchableNativeFeedback,
  Alert,
  TouchableWithoutFeedback,
  RefreshControl,
  FlatList,
  BackHandler,
  Vibration,
} from 'react-native';
import {
  Colors,
  Appbar,
  TextInput,
  Title,
  ActivityIndicator,
  FAB,
  Caption,
  Divider,
  List,
  Button,
  Menu,
} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import Axios from 'axios';
// import DatePicker from 'react-native-datepicker';
import {LoadingIndicator, ErrorData, InputOption} from '../components';
import {AppContext} from '../context';
// import Modal from 'react-native-modal';
// import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {AppExt} from '../utils';

function toRupiah(angka, prefix) {
  var number_string = angka.replace(/[^,\d]/g, '').toString(),
    split = number_string.split(','),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  let separator = '';
  if (ribuan) {
    // eslint-disable-next-line no-undef
    separator = sisa ? '.' : '';
    // eslint-disable-next-line no-undef
    rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
  return prefix === undefined ? rupiah : rupiah ? 'Rp. ' + rupiah : '';
}

export class MedicalClaimStagingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      refreshing: false,
      requestError: false,

      stagingClaims: [],
      idClaim: null,

      selectId: null,
      isMoreActionMenuVisible: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    this.getClaimData();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick = () => {
    if (this.countSelected() > 0) {
      this.handleSelect(null);
      return true;
    }
    return false;
  };

  reload = () => {
    this.setState({loading: true}, this.getClaimData);
  };

  goBack = () => {
    this.props.route.params.onGoBack();
    this.props.navigation.goBack();
  };
  refresh = () => {
    this.setState({refreshing: true});
    this.getClaimData();
  };

  getClaimData = () => {
    Axios.get(`/claimForm/${this.context.userData.nrp}`)
      .then((res) => {
        const formattedStagingClaims = res.data.item.map((item, index) => ({
          isSelected: false,
          data: item,
        }));

        this.setState({
          loading: false,
          refreshing: false,
          requestError: false,

          stagingClaims: formattedStagingClaims,
          idClaim: res.data.id_claim,
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

  deleteStagingClaim = () => {
    this.setState({loading: true});
    let idClaim;
    for (let index = 0; index < this.state.stagingClaims.length; index++) {
      if (this.state.stagingClaims[index].isSelected === true) {
        idClaim = this.state.stagingClaims[index].data.id;
        break;
      }
    }
    this.handleSelect(null);
    // console.warn(idClaim);
    Axios.post('/claimItemRemove', {
      id: idClaim,
    })
      .then((res) => {
        alert('Deleting ....');
        this.reload();
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        alert('terjadi kesalahan: ' + e);
      });
  };

  handleFinish = () => {
    this.context.setLoading(true);

    Axios.post('/claimFinish', {
      id: this.state.idClaim,
    })
      .then((response) => {
        this.context.setLoading(false);

        Alert.alert(
          'Success',
          `${response.data.message}`,
          [
            {
              text: 'OK',
              onPress: () => {
                this.goBack();
              },
            },
          ],
          {
            onDismiss: () => {
              this.props.navigation.state.params.goBack();
              this.props.navigation.goBack();
            },
          },
        );
      })
      .catch((error) => {
        this.context.setLoading(false);

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
  };

  countSelected = () => {
    return this.state.stagingClaims.reduce((total, cur) => {
      if (cur.isSelected) {
        return total + 1;
      }
      return total;
    }, 0);
  };

  selectAll = () => {
    const claims = this.state.stagingClaims.map((item) => ({
      ...item,
      isSelected: true,
    }));
    this.setState({
      stagingClaims: claims,
      isMoreActionMenuVisible: false,
    });
  };

  handleSelect = (id) => {
    if (id == null) {
      const claims = this.state.stagingClaims.map((item) => ({
        ...item,
        isSelected: false,
      }));
      this.setState({
        stagingClaims: claims,
      });
      return;
    }

    let claims = [...this.state.stagingClaims];
    claims[id].isSelected = !claims[id].isSelected;
    this.setState({
      stagingClaims: claims,
    });
  };

  render() {
    const countSelected = this.countSelected();
    const isSelectMode = countSelected > 0 ? true : false;
    // const {params} = this.props.navigation.state;

    return (
      <>
        <StatusBar
          barStyle={isSelectMode ? 'dark-content' : 'light-content'}
          hidden={false}
          backgroundColor={isSelectMode ? Colors.grey100 : '#0F4C75'}
          translucent={false}
        />

        <Appbar.Header
          style={[
            {zIndex: 3},
            isSelectMode && {backgroundColor: Colors.white},
          ]}>
          <Appbar.Action
            icon={isSelectMode ? 'close' : 'chevron-left'}
            onPress={() => {
              if (isSelectMode) {
                this.handleSelect(null);
                return;
              }
              this.goBack();
            }}
          />
          <Appbar.Content
            title={
              !isSelectMode
                ? 'Pengajuan Sementara'
                : `${countSelected} Item${countSelected > 1 ? 's' : ''}`
            }
          />

          {!isSelectMode ? (
            <Button
              mode="text"
              disabled={
                this.state.stagingClaims.length === 0 || this.state.loading
              }
              onPress={this.handleFinish}
              color={Colors.black}>
              SEND
            </Button>
          ) : (
            <>
              {countSelected == 1 && (
                <>
                  <Appbar.Action icon="pencil" onPress={() => {}} />
                  <Appbar.Action
                    icon="delete"
                    onPress={() => this.deleteStagingClaim()}
                  />
                </>
              )}
              {/* <Appbar.Action icon="select-all" onPress={this.selectAll} /> */}
              <Menu
                visible={this.state.isMoreActionMenuVisible}
                onDismiss={() =>
                  this.setState({isMoreActionMenuVisible: false})
                }
                anchor={
                  <Appbar.Action
                    // icon="more-vert"
                    icon="menu"
                    onPress={() =>
                      this.setState({isMoreActionMenuVisible: true})
                    }
                  />
                }>
                <Menu.Item onPress={this.selectAll} title="Select all" />
              </Menu>
            </>
          )}
        </Appbar.Header>

        <Divider />

        <View style={{flex: 1}}>
          {this.state.loading ? (
            <LoadingIndicator />
          ) : this.state.requestError ? (
            <ErrorData onRetry={this.getClaimData} />
          ) : (
            // <ScrollView
            //   style={{paddingHorizontal: 0}}
            //   showsVerticalScrollIndicator={true}
            //   refreshControl={
            //     <RefreshControl
            //       refreshing={this.state.refreshing}
            //       onRefresh={this.refresh}
            //     />
            //   }>
            <FlatList
              // style={{ padding: 10, paddingBottom: 45 }}
              data={this.state.stagingClaims}
              renderItem={({item, index}) => (
                <List.Item
                  // rippleColor={isSelectMode && "transparent"}
                  key={index}
                  title={`${item.data.nama_pasien}`}
                  description={`${item.data.id}`}
                  delayLongPress={300}
                  onPress={() =>
                    isSelectMode ? this.handleSelect(index) : null
                  }
                  onLongPress={() => {
                    Vibration.vibrate(30);
                    this.handleSelect(index);
                  }}
                  onPressOut={() => {}}
                  style={
                    item.isSelected
                      ? {
                          backgroundColor: Colors.yellow100,
                        }
                      : {}
                  }
                  left={
                    !isSelectMode
                      ? null
                      : (props) => (
                          <List.Icon
                            {...props}
                            icon={
                              item.isSelected
                                ? 'radiobox-marked'
                                : 'radiobox-blank'
                            }
                          />
                        )
                  }
                  right={(props) => (
                    <Text
                      style={{
                        alignSelf: 'center',
                        color: Colors.grey700,
                        fontWeight: 'bold',
                      }}>
                      {`${toRupiah(item.data.jumlah, 'Rp')}`}
                    </Text>
                  )}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={Divider}
            />
            // </ScrollView>
          )}
        </View>

        {!this.state.loading && !this.state.requestError && (
          <FAB
            visible={!isSelectMode}
            style={{
              position: 'absolute',
              margin: 25,
              right: 0,
              bottom: 0,
            }}
            icon="plus"
            onPress={() =>
              this.props.navigation.navigate('MedicalEntry', {
                onGoBack: () => this.reload(),
              })
            }
          />
        )}
      </>
    );
  }
}

MedicalClaimStagingScreen.contextType = AppContext;

export default MedicalClaimStagingScreen;
