import React, {Component} from 'react';
import {View, Divider, FlatList} from 'react-native';
import {ImageMenuItem} from './components';

const RbSheetMenu = () => {
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
      onPress: () => this.props.navigation.navigate('Peduli'),
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
    <>
      <View
        style={{
          alignItems: 'center',
          height: 70,
          justifyContent: 'center',
        }}>
        {/* <FeatherIcons name="minus" size={60} color={Colors.grey800} /> */}
      </View>
      <Divider style={{height: 0.15}} />
      <FlatList
        // scrol
        data={menuData}
        contentContainerStyle={{alignItems: 'center'}}
        numColumns={3}
        renderItem={({item}) =>
          ((item.isOprOnly == true && this.context.status.isNonOpr == false) ||
            item.isOprOnly == false) && (
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
  );
};
export default RbSheetMenu;
