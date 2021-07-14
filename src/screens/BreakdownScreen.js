import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Colors,
  Appbar,
  Caption,
  List,
  Divider,
  FAB,
  Portal,
} from 'react-native-paper';
import Axios from 'axios';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ReportBreakdownDialog,
  LoadingIndicator,
  ErrorData,
} from '../components';
import {AppContext} from '../context';

class BreakdownScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      breakdownList: [],
      isLoading: false,
      isRefreshing: false,
      isRequestError: false,

      reportBreakdownDialogVisible: false,
    };
  }

  componentDidMount() {
    this.reload();
  }

  goBack = () => {
    this.props.navigation.navigate('Home');
    // alert("sss");
  };

  showReportBreakdownDialog = () => {
    this.setState({reportBreakdownDialogVisible: true});
  };

  hideReportBreakdownDialog = () => {
    this.setState({reportBreakdownDialogVisible: false});
  };

  getUnitBreakdown = () => {
    Axios.get(`/breakdown/${this.context.status.unit}`)
      .then((res) => {
        this.setState({
          isLoading: false,
          isRefreshing: false,
          isRequestError: false,
          breakdownList: res.data,
        });
      })
      .catch((error) => {
        alert(error);
        this.setState({
          isLoading: false,
          isRefreshing: false,
          isRequestError: true,
        });
      });
  };

  reload = () => {
    this.setState({isLoading: true}, this.getUnitBreakdown);
  };

  refresh = () => {
    this.setState({isRefreshing: true});
    this.getUnitBreakdown();
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
        <SafeAreaView style={{flex: 1}}>
          <Appbar.Header style={{zIndex: 3}}>
            <Appbar.BackAction onPress={this.goBack} />
            <Appbar.Content title="Breakdown History" />
          </Appbar.Header>
          <View style={{flex: 1}}>
            {this.state.isLoading ? (
              <LoadingIndicator />
            ) : this.state.isRequestError ? (
              <ErrorData onRetry={this.reload} />
            ) : !this.state.breakdownList ? (
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
                  <Caption>No Check In History</Caption>
                </View>
              </>
            ) : (
              <View
                // <ScrollView
                style={{paddingHorizontal: 0}}
                showsVerticalScrollIndicator={true}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.refresh}
                  />
                }>
                <FlatList
                  style={{padding: 10, paddingBottom: 45}}
                  data={this.state.breakdownList}
                  renderItem={({item, index}) => (
                    <List.Item
                      key={index}
                      title={`${item.cn} at ${item.lokasi}`}
                      description={`${item.opr_remark}`}
                      // onPress={() => null}
                      left={(props) => (
                        <List.Icon {...props} icon={'clock-outline'} />
                        // <List.Icon {...props} icon={'access-time'} />
                      )}
                      right={(props) => (
                        <List.Icon
                          {...props}
                          color={
                            item.status == 0 ? Colors.grey700 : Colors.grey300
                          }
                          icon="chevron-right"
                        />
                      )}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={Divider}
                />
              </View>
              // </ScrollView>
            )}
          </View>

          <FAB
            style={{
              position: 'absolute',
              margin: 20,
              right: 0,
              bottom: 0,
            }}
            icon="pencil"
            // onPress={null}
            onPress={this.showReportBreakdownDialog}
          />

          <Portal>
            <ReportBreakdownDialog
              reportBreakdownDialogVisible={
                this.state.reportBreakdownDialogVisible
              }
              hideReportBreakdownDialog={this.hideReportBreakdownDialog}
              onSubmit={() => this.refresh()}
            />
          </Portal>
        </SafeAreaView>
      </>
    );
  }
}
export default BreakdownScreen;
BreakdownScreen.contextType = AppContext;
