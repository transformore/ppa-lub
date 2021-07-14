import React, {Component} from 'react';
import {View, FlatList, Dimensions, Button} from 'react-native';
import {Divider, List, Colors} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import {AppContext} from '../context';

import {ImageMenuItem, HomeCarousel, HmStartDialog} from '../components';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import FeatherIcons from 'react-native-vector-icons/Feather';

class UserContents extends Component {
  render() {
    return (
      <RBSheet
        animationType={'fade'}
        closeOnDragDown
        height={500}
        duration={200}
        onClose={() => this.setState({isMenuSheetOpen: false})}
        ref={(ref) => {
          this.RBSheet2 = ref;
        }}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            width: Dimensions.get('window').width - 30,
            marginHorizontal: 15,
            backgroundColor: '#FFFFFF',
            borderColor: '#707070',
            borderRadius: 10,
            borderWidth: 0.5,
            bottom: 65,
          },
        }}>
        <View
          style={{
            alignItems: 'center',
            height: 75,
            justifyContent: 'center',
          }}>
          {/* <FeatherIcons name="minus" size={60} color={Colors.grey800} /> */}
        </View>
        <Divider />
        <View
          style={{
            height: 300,
            flexDirection: 'column',
          }}>
          {/* <View>{renderUserContents()}</View> */}
          <View
            style={{
              alignItems: 'center',
              height: 70,
              justifyContent: 'center',
            }}>
            {/* <FeatherIcons name="minus" size={60} color={Colors.grey800} /> */}
          </View>
          <Divider style={{height: 0.15}} />
          <View style={{justifyContent: 'center'}}>
            <List.Item
              title="User"
              description={this.context.userData.nama}
              left={(props) => <List.Icon {...props} icon="person" />}
            />
          </View>

          <View style={{alignItems: 'center'}}>
            <Button
              style={{
                height: 40,
                width: 220,
                marginBottom: 20,
                marginTop: 35,
                borderRadius: 25,
                backgroundColor: 'transparent',
                justifyContent: 'center',
              }}
              mode={'contained'}
              icon={({size, color}) => (
                <Icons name={''} size={size} color={color} />
              )}
              onPress={() => {
                this.RBSheet2.close();
                this.setState({isMenuSheetOpen: false});
                setTimeout(() => {
                  this.props.navigation.navigate('ChangePassword');
                }, 150);
              }}>
              Change Password
            </Button>
          </View>

          <Divider />
          <View style={{alignItems: 'center'}}>
            <Button
              color={Colors.primary}
              // color={"#FFA41B"}
              style={{
                height: 55,
                width: 200,
                marginTop: 25,
                backgroundColor: '#FFA41B',
                marginBottom: 20,
                borderRadius: 25,
                justifyContent: 'center',
              }}
              mode={'contained'}
              onPress={this.logoutAsync}
              icon={({size, color}) => (
                <Icons name={'power'} size={size} color={color} />
              )}>
              Logout
            </Button>
          </View>
        </View>
      </RBSheet>
    );
  }
}

UserContents.contextType = AppContext;
export default UserContents;
