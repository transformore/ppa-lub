import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
import {Colors, Appbar, FAB, Caption, List, Divider} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import Axios from 'axios';
import {LoadingIndicator, ErrorData, InputOption} from '../components';
import {AppContext} from '../context';
import Modal from 'react-native-modal';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
const {width, height} = Dimensions.get('screen');

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

export class MedicalClaimScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      refreshing: false,
      requestError: false,

      stagingClaims: [],
      claimHistories: [],
    };
  }

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    this.setState({loading: true}, this.getClaimData);
  };

  refresh = () => {
    this.setState({refreshing: true});
    this.getClaimData();
  };

  getClaimData = () => {
    Axios.get(`/claimForm/${this.context.userData.nrp}`)
      .then((res1) => {
        Axios.get(`/claimHistorical/${this.context.userData.nrp}`)
          .then((res2) => {
            this.setState({
              loading: false,
              refreshing: false,
              requestError: false,

              claimHistories: res2.data,
              stagingClaims: res1.data.item,
            });
            // alert(JSON.stringify(res2.data));
          })
          .catch((e) => {
            this.setState({
              loading: false,
              refreshing: false,
              requestError: true,
            });
            alert('terjadi kesalahan: ' + e);
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

  render() {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={'#0F4C75'}
          translucent={false}
        />

        <Appbar.Header style={{zIndex: 3}}>
          <Appbar.BackAction
            onPress={() => this.props.navigation.replace('Home')}
          />
          <Appbar.Content title="Claim History" />
        </Appbar.Header>

        <View style={{flex: 1}}>
          {this.state.loading ? (
            <LoadingIndicator />
          ) : this.state.requestError ? (
            <ErrorData onRetry={this.getClaimData} />
          ) : this.state.claimHistories.length > 0 ? (
            <View
              height={height * 0.73}
              style={{paddingHorizontal: 0}}
              showsVerticalScrollIndicator={true}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.refresh}
                />
              }>
              <FlatList
                // style={{ padding: 10, paddingBottom: 45 }}
                data={this.state.claimHistories}
                renderItem={({item, index}) => (
                  <List.Item
                    key={index}
                    title={`${item.nama}`}
                    description={`${item.id}/${item.created_date}`}
                    // onPress={() => null}
                    right={(props) => (
                      <View style={{width: 110}}>
                        <Text
                          style={{
                            alignSelf: 'flex-start',
                            color: Colors.grey700,
                            fontWeight: 'bold',
                          }}>{`${toRupiah(item.total, 'Rp')}`}</Text>
                        <Text style={{fontSize: 10}}>{item.status}</Text>
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
        </View>

        {!this.state.loading && !this.state.requestError && (
          <>
            {this.state.stagingClaims.length > 0 ? (
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate('MedicalStaging', {
                    onGoBack: () => this.refresh(),
                  })
                }>
                <View
                  style={{
                    backgroundColor: Colors.amber500,
                    position: 'absolute',
                    margin: 20,
                    padding: 10,
                    borderRadius: 7.5,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icons
                    name={'check-circle'}
                    size={27}
                    color={Colors.amber900}
                  />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      marginLeft: 10,
                    }}>{`${this.state.stagingClaims.length} Claim siap diajukan`}</Text>
                  <View style={{flex: 1}} />
                  <Icons
                    name={'chevron-right'}
                    size={27}
                    color={Colors.amber900}
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <FAB
                style={{
                  position: 'absolute',
                  marginBottom: 20,
                  marginRight: 25,
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
        )}
      </>
    );
  }
}

MedicalClaimScreen.contextType = AppContext;

export default MedicalClaimScreen;
