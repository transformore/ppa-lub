import React, {Component} from 'react';
import {View, FlatList, Dimensions, Button, StatusBar} from 'react-native';
import {Divider, Appbar} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import {AppContext} from '../context';

import {ImageMenuItem, HomeCarousel, HmStartDialog} from '../components';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import FeatherIcons from 'react-native-vector-icons/Feather';

class MenuContents extends Component {
  render() {
    const menuData = [
      {
        label: 'Formulir P2H',
        onPress: () => this.props.navigation.navigate('PreUse'),
        image: require('../assets/image/menu/preusecheck3D.png'),
        elevation: 3,
        isOprOnly: false,
      },
      {
        label: 'Minta Perbaikan',
        onPress: () => this.props.navigation.navigate('Breakdown'),
        // onPress: () => alert("tes"),
        image: require('../assets/image/menu/repair3D.png'),
        isOprOnly: false,
      },
      {
        label: 'Laporkan Bahaya',
        onPress: () => this.props.navigation.navigate('Hazard'),
        // onPress: () => alert("tes"),
        image: require('../assets/image/menu/hazard3D.png'),
        isOprOnly: false,
      },

      {
        label: 'Catatan Kehadiran',
        onPress: () => this.props.navigation.navigate('Absen'),
        image: require('../assets/image/menu/hadir3D.png'),
        isOprOnly: false,
      },
      {
        label: 'Catatan HM Operasi',
        onPress: () => this.props.navigation.navigate('Hourmeter'),
        image: require('../assets/image/menu/hourmeter3D.png'),
        isOprOnly: false,
      },
      {
        label: 'Pengajuan Cuti',
        onPress: () => this.props.navigation.navigate('Leaving'),
        image: require('../assets/image/menu/leave3D.png'),
        isOprOnly: false,
      },
      {
        label: 'Saya Peduli',
        // onPress: () => this.props.navigation.navigate("Breakdown"),
        onPress: () => this.props.navigation.navigate('SayaPeduli'),
        image: require('../assets/image/menu/care.png'),
        isOprOnly: false,
      },
      {
        label: 'Peraturan Perusahaan',
        // onPress: () => this.props.navigation.navigate("Breakdown"),
        // onPress: () => alert("tes"),
        image: require('../assets/image/menu/pp_3d.png'),
        isOprOnly: false,
      },
      {
        label: 'Medical Claim',
        onPress: () => this.props.navigation.navigate('Medical'),
        // onPress: () => alert("tes"),
        image: require('../assets/image/menu/medic.png'),
        isOprOnly: false,
      },

      {
        label:
          this.context.status.isCheckedIn && !this.context.status.isNonOpr
            ? this.context.status.hmStart == null
              ? 'Mulai Operasi'
              : this.context.status.hmStop == null &&
                this.context.status.hmStart != null
              ? 'Stop Operasi'
              : 'Mulai Operasi'
            : 'Mulai Operasi',
        onPress: () =>
          this.context.status.isCheckedIn && !this.context.status.isNonOpr
            ? this.context.status.hmStart == null
              ? this.showHmStartDialog()
              : this.context.status.hmStop == null &&
                this.context.status.hmStart != null
              ? this.showHmStopDialog()
              : alert('isi parking location terlebih dahulu')
            : alert('check in terlebih dahulu'),
        image: require('../assets/image/menu/stop3D.png'),
        isOprOnly: true,
      },
    ];

    return (
      <View>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          translucent={false}
          backgroundColor={'#0F4C75'}
        />

        <Appbar.Header style={{zIndex: 3}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Laporan Bahaya" />
        </Appbar.Header>

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Button
            title="OPEN BOTTOM SHEET"
            onPress={() => this.RBSheet.open()}
          />
          <RBSheet
            animationType={'fade'}
            closeOnDragDown
            height={600}
            duration={200}
            onClose={() => this.setState({isMenuSheetOpen: false})}
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            customStyles={{
              wrapper: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
            <View style={{height: 500, backgroundColor: 'clear'}}>
              {/* <MenuContents /> */}
              <>
                <View
                  style={{
                    alignItems: 'center',
                    height: 70,
                    justifyContent: 'center',
                  }}></View>
                <Divider style={{height: 0.15}} />
                <FlatList
                  data={menuData}
                  contentContainerStyle={{alignItems: 'center'}}
                  numColumns={3}
                  renderItem={({item}) =>
                    ((item.isOprOnly === true &&
                      this.context.status.isNonOpr === false) ||
                      item.isOprOnly === false) && (
                      <ImageMenuItem
                        label={item.label}
                        style={{marginHorizontal: 25}}
                        image={item.image}
                        onPress={() => {
                          this.RBSheet.close();
                          item.onPress();
                        }}
                      />
                    )
                  }
                  ListHeaderComponent={<View style={{height: 20}} />}
                  ListFooterComponent={<View style={{height: 20}} />}
                  ItemSeparatorComponent={() => <View style={{height: 20}} />}
                  keyExtractor={(item, index) => index.toString()}
                />
                <Divider style={{height: 0.25}} />
              </>
            </View>
          </RBSheet>
        </View>
      </View>
    );
  }
}

MenuContents.contextType = AppContext;
export default MenuContents;
