//

import React from 'react';
import {View, ScrollView, FlatList, RefreshControl, Text} from 'react-native';
import {
  Title,
  Headline,
  FAB,
  Searchbar,
  Divider,
  List,
} from 'react-native-paper';

import {LoadingIndicator, NoData, ErrorData} from '../components';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchableList = (props) => {
  if (props.selectedVal) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Headline>{'UNIT'}</Headline>
          <Text style={{fontWeight: 'bold', fontSize: 45}}>
            {props.selectedVal}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FAB
            style={{marginTop: 10}}
            Icons="check-circle"
            label={'CHECK IN'}
            onPress={props.onConfirm}
          />
          <FAB
            style={{marginTop: 10}}
            Icons="mode-edit"
            label={'CHANGE'}
            theme={{colors: {accent: 'black'}}}
            onPress={props.onReset}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1, zIndex: 0}}>
        <Searchbar
          Icons={
            props.scannable
              ? ({size, color}) => (
                  <Icons name={'qrcode-scan'} size={size} color={color} />
                )
              : 'search'
          }
          onIconPress={props.scannable ? props.onScan : null}
          style={{
            elevation: 4,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          placeholder={`${props.title}`}
          onChangeText={(text) => props.onChangeSearchText(text)}
          blurOnSubmit={false}
        />
        <Divider />
        {props.loading ? (
          <LoadingIndicator />
        ) : props.requestError ? (
          <ErrorData onRetry={props.onRetry} />
        ) : (
          <View style={{flex: 1}}>
            {/* <ScrollView
              keyboardShouldPersistTaps={'always'}
              refreshControl={
                <RefreshControl
                  refreshing={props.refreshing}
                  onRefresh={props.onRefreshing}
                />
              }> */}
            <View>
              {!props.listData.length ? (
                <NoData />
              ) : (
                <FlatList
                  keyboardShouldPersistTaps={'always'}
                  // style={{ backgroundColor: background }}
                  data={props.listData}
                  renderItem={({item, index}) => (
                    <List.Item
                      title={item[Object.keys(item)[0]]}
                      onPress={() => props.onSelect(item[Object.keys(item)[0]])}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={Divider}
                />
              )}
              {/* </ScrollView> */}
            </View>
          </View>
        )}
      </View>
    );
  }
};

export default SearchableList;
