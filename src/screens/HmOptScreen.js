import React, {Component} from 'react';
import {View, Text, StatusBar, StyleSheet} from 'react-native';
import {Colors, Appbar, Caption, Card, Divider} from 'react-native-paper';
import Axios from 'axios';
import {LoadingIndicator, ErrorData} from '../components';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import {AppContext} from '../context';

export class HmOptScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listAbsensi: [],
      isLoading: true,
      isRequestError: false,
    };
  }

  componentDidMount() {
    this.getHourmeter();
  }

  getHourmeter = () => {
    this.setState({
      isLoading: true,
    });
    Axios.get(`/hm/${this.context.userData.nrp}`)
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
          backgroundColor={'#0F4C75'}
          translucent={false}
        />

        <Appbar.Header style={{zIndex: 3}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Hour Meter Report" />
        </Appbar.Header>

        <View
          style={{
            backgroundColor: '#0984e3',
            flexDirection: 'row',
          }}>
          <Text style={styles.header}>Date</Text>
          <Text style={styles.header}>CN</Text>
          <Text style={styles.header}>HM Start</Text>
          <Text style={styles.header}>HM Stop</Text>
          <Text style={styles.header}>HM Total</Text>
        </View>

        <View style={{flex: 1}}>
          {this.state.isLoading ? (
            <LoadingIndicator />
          ) : this.state.isRequestError ? (
            <ErrorData onRetry={this.getHourmeter} />
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
                  'Mei',
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
                  // <Card style={{elevation: 1}}>
                  <View>
                    <View style={{flexDirection: 'row', margin: 1}}>
                      <Text style={styles.content}>{formattedDate || '-'}</Text>
                      <Text style={styles.content}>{item.unit || '-'}</Text>
                      <Text style={styles.content}>{item.hm_start || '-'}</Text>
                      <Text style={styles.content}>{item.hm_stop || '-'}</Text>
                      <Text style={styles.content}>{item.hm_total || '-'}</Text>
                    </View>
                    <View>
                      <Divider style={{height: 1}}></Divider>
                    </View>
                  </View>

                  // </Card>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
              contentContainerStyle={{padding: 5}}
            />
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.white,
    width: 78,
    textAlign: 'center',
    marginVertical: 1,
  },
  content: {
    paddingLeft: 10,
    paddingVertical: 2,
    fontSize: 15,
    color: Colors.grey800,
    width: 80,
    textAlign: 'center',
    justifyContent: 'center',
  },
});

HmOptScreen.contextType = AppContext;
export default HmOptScreen;
