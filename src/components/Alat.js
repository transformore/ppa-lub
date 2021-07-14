import React, {Component} from 'react';
import {SearchableList} from '../components';
import axios from 'axios';
import {AppContext} from '../context';
import {View, Text, Dimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {width, height} = Dimensions.get('screen');
const h_margin = 15;

class Alat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listData: [],
      loading: false,
      refreshing: false,
      requestError: false,
      unit: null,
    };

    this.listDataHolder = [];
  }

  componentDidMount() {
    this._reload();
  }

  _getListData = () => {
    axios
      .get(`/unit/${this.context.userData.nrp}`)
      .then((res) => {
        this.setState(
          {
            loading: false,
            refreshing: false,
            requestError: false,
            listData: res.data,
          },
          () => {
            this.listDataHolder = this.state.listData;
          },
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
          refreshing: false,
          requestError: true,
        });
        alert(error);
      });
  };

  _resetData = () => {
    this.setState({unit: null});
  };

  _searchText = (text) => {
    const newData = this.listDataHolder.filter((item) => {
      const itemData = `${item.code_number.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({listData: newData});
  };

  _select = (val) => {
    this.setState({listData: this.listDataHolder, unit: val});
  };

  _reload = () => {
    this.setState({loading: true}, this._getListData);
  };

  _refresh = () => {
    this.setState({refreshing: true}, this._getListData);
  };

  onConfirmCheckIn = () => {
    // this.context.checkInDev(this.state.unit, () => this.props.goBack());
    this.context.checkIn(this.state.unit, () => this.props.goBack());
  };

  render() {
    return (
      <View style={{height: height - 200, backgroundColor: 'white'}}>
        <SearchableList
          selectedVal={this.state.unit}
          title={'Cari'}
          listData={this.state.listData}
          loading={this.state.loading}
          refreshing={this.state.refreshing}
          onRefreshing={this._refresh}
          onReset={this._resetData}
          onConfirm={this.onConfirmCheckIn}
          onChangeSearchText={this._searchText}
          onSelect={this._select}
          requestError={this.state.requestError}
          onRetry={this._reload}
        />
      </View>
    );
  }
}

Alat.contextType = AppContext;
export default Alat;
