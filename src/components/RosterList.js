import React, {Component} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  RefreshControl,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {
  Title,
  Headline,
  FAB,
  Searchbar,
  Divider,
  List,
  Colors,
} from 'react-native-paper';
import {LoadingIndicator, NoData, ErrorData} from '.';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import axios from 'axios';
import {AppContext} from '../context';

export default class RosterList extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      listData: [],
      isLoading: false,
      isRefreshing: false,

      isRequestError: false,

      keyboardState: 'closed',
      searchText: '',
    };

    this.listDataHolder = [];
  }

  componentDidMount() {
    this._isMounted = true;
    this.reload();
    // }

    // UNSAFE_componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState(
      {
        keyboardState: 'opened',
      },
      () => console.log(this.state.keyboardState),
    );
  };

  _keyboardDidHide = () => {
    this.setState(
      {
        keyboardState: 'closed',
      },
      () => console.log(this.state.keyboardState),
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.val != nextProps.val || this.state != nextState;
  }

  getListData = () => {
    this.setState({isLoading: true});
    axios
      .get(`/roster`)
      .then((res) => {
        this.setState(
          {
            isLoading: false,
            isRefreshing: false,
            requestError: false,
            listData: res.data,
          },
          () => {
            this.listDataHolder = this.state.listData;
          },
        );
      })
      .catch((error) => {
        alert(error);
        this.setState({
          isLoading: false,
          isRefreshing: false,
          requestError: true,
        });
      });
  };

  resetData = () => {
    this.props.onSet(null);
  };

  searchText = (text) => {
    const newData = this.listDataHolder.filter((item) => {
      const itemData = `${item.roster.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({listData: newData});
  };

  select = (val) => {
    this.props.onSet(val);
    // alert(JSON.stringify(val));
    this.setState({listData: this.listDataHolder});
  };

  reload = () => {
    this.setState({isLoading: true}, this.getListData);
  };

  refresh = () => {
    this.setState({isRefreshing: true}, this.getListData);
  };

  render() {
    if (this.props.val) {
      return (
        <TouchableOpacity
          activeOpacity={this.state.keyboardState == 'closed' ? 1 : 0.7}
          style={{flex: 1}}
          onPress={() =>
            this.state.keyboardState == 'closed' ? null : Keyboard.dismiss()
          }>
          <View
            style={[
              {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              },
              this.state.keyboardState == 'closed'
                ? null
                : {
                    backgroundColor: Colors.grey900,
                    margin: 10,
                    borderRadius: 30,
                  },
            ]}>
            <Title
              style={
                this.state.keyboardState == 'closed'
                  ? {color: Colors.grey600}
                  : {color: Colors.white}
              }>
              Roster
            </Title>
            <Headline
              style={[
                this.state.keyboardState == 'closed'
                  ? null
                  : {color: Colors.white},
                {fontSize: 30},
              ]}>
              {this.props.val.roster}
            </Headline>
            {this.state.keyboardState == 'closed' ? (
              <FAB
                style={{marginTop: 10}}
                icon="pencil-outline"
                label={'CHANGE'}
                theme={{colors: {accent: Colors.grey800}}}
                onPress={this.resetData}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <Searchbar
            icon={'card-search-outline'}
            value={this.state.searchText}
            style={{
              elevation: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
            placeholder={`Search roster`}
            onChangeText={(text) => {
              this.setState({searchText: text}, () =>
                this.searchText(this.state.searchText),
              );
            }}
            blurOnSubmit={false}
          />
          <Divider />
          {this.state.isLoading ? (
            <LoadingIndicator />
          ) : this.state.isRequestError ? (
            <ErrorData onRetry={this.reload} />
          ) : this.state.searchText == 'Logout' ? (
            <>
              <List.Item
                title="Logout"
                onPress={() => this.props.onLogout()}
                description={'Keluar dari akun'}
                left={(props) => <List.Icon {...props} icon="lock-open" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
              <Divider />
            </>
          ) : (
            <View style={{flex: 1}}>
              <ScrollView
                keyboardShouldPersistTaps={'always'}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.refresh}
                  />
                }>
                {!this.state.listData.length ? (
                  <NoData />
                ) : (
                  <FlatList
                    keyboardShouldPersistTaps={'always'}
                    // style={{ backgroundColor: background }}
                    data={this.state.listData}
                    renderItem={({item, index}) => (
                      <List.Item
                        title={item.roster}
                        onPress={() => this.select(item)}
                      />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={Divider}
                  />
                )}
              </ScrollView>
            </View>
          )}
        </View>
      );
    }
  }
}

RosterList.contextType = AppContext;
