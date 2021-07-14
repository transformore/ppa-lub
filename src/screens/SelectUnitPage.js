import React, {Component, Fragment} from 'react';
import {Text, View, SafeAreaView, StatusBar} from 'react-native';
import {Appbar, Colors} from 'react-native-paper';
import {SearchableList} from '../components';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppContext} from '../context';
import {Alat} from '../components';

class SelectUnitPage extends Component {
  goBack = () => {
    this.props.navigation.navigate('Home');
    // alert("sss");
  };

  render() {
    return (
      <Fragment>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={'#0F4C75'}
          translucent={false}
        />
        <SafeAreaView style={{flex: 1}}>
          <Appbar.Header style={{zIndex: 3}}>
            <Appbar.BackAction onPress={this.goBack} />
            <Appbar.Content title="Pilih Unit" />
          </Appbar.Header>
          <Alat goBack={this.goBack} />
        </SafeAreaView>
      </Fragment>
    );
  }
}

export default SelectUnitPage;
