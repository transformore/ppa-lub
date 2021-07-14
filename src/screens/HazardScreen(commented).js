// import React, {Component} from 'react';
// import {
//   Text,
//   View,
//   StatusBar,
//   TouchableNativeFeedback,
//   Alert,
//   Keyboard,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from 'react-native';
// import {
//   Colors,
//   Appbar,
//   TextInput,
//   Title,
//   ActivityIndicator,
// } from 'react-native-paper';

// import {ScrollView} from 'react-native-gesture-handler';
// import ImagePicker from 'react-native-image-crop-picker';
// import FeatherIcons from 'react-native-vector-icons/Feather';
// import RBSheet from 'react-native-raw-bottom-sheet';
// import Axios from 'axios';
// import {AppContext} from '../context';
// import Modal from 'react-native-modal';
// import {LoadingIndicator, ErrorData, InputOption} from '../components';

// const {width, height} = Dimensions.get('screen');

// export class HazardScreen extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       loading: true,
//       refreshing: false,
//       requestError: false,

//       ktaId: null,
//       detailKta: '',
//       lokasiId: null,
//       detailLokasi: '',
//       deptId: null,
//       picId: null,
//       isPicLoading: true,
//       kodeBahaya: '',
//       status: '',
//       tindakanPerbaikan: '',
//       image: null,

//       ktaOptions: null,
//       lokasiOptions: null,
//       deptOptions: null,
//       picOptions: null,
//       keyboardState: 'closed',
//     };
//   }

//   componentDidMount() {
//     this.keyboardDidShowListener = Keyboard.addListener(
//       'keyboardDidShow',
//       this._keyboardDidShow,
//     );
//     this.keyboardDidHideListener = Keyboard.addListener(
//       'keyboardDidHide',
//       this._keyboardDidHide,
//     );

//     this.getHazardData();
//   }

//   componentWillUnmount() {
//     this.keyboardDidShowListener.remove();
//     this.keyboardDidHideListener.remove();
//   }

//   _keyboardDidShow = () => {
//     this.setState({
//       keyboardState: 'opened',
//     });
//   };

//   _keyboardDidHide = () => {
//     this.setState({
//       keyboardState: 'closed',
//     });
//   };

//   getHazardData = () => {
//     this.setState({loading: true});
//     Axios.get(`/hazardForm`)
//       .then((res) => {
//         // alert(JSON.stringify(res.data));
//         const formattedKta = res.data.kta.map((item, index) => ({
//           id: index,
//           code: item.id,
//           name: item.kta,
//         }));
//         const formattedLokasi = res.data.lokasi.map((item, index) => ({
//           id: index,
//           code: item.id,
//           name: item.lokasi,
//         }));
//         const formattedDept = res.data.dept.map((item, index) => ({
//           id: index,
//           name: item,
//         }));

//         this.setState({
//           loading: false,
//           refreshing: false,
//           requestError: false,

//           ktaOptions: formattedKta,
//           lokasiOptions: formattedLokasi,
//           deptOptions: formattedDept,
//         });
//       })
//       .catch((error) => {
//         this.setState({
//           loading: false,
//           refreshing: false,
//           requestError: true,
//         });
//         alert('Terjadi kesalahan: ' + error);
//       });
//   };

//   handleSetDept = (id) => {
//     this.setState({deptId: id, picId: null});
//     this.getPicData(this.state.deptOptions[id].name);
//   };

//   getPicData = (dept) => {
//     this.setState({isPicLoading: true});
//     Axios.get(`/namaByDept/${dept}`)
//       .then((res) => {
//         // alert(JSON.stringify(res.data));
//         const formattedPic = res.data.map((item, index) => ({
//           id: index,
//           nrp: item.nrp,
//           name: item.nama,
//         }));

//         this.setState({
//           isPicLoading: false,
//           picOptions: formattedPic,
//         });
//       })
//       .catch((error) => {
//         this.setState({
//           isPicLoading: false,
//           deptId: null,
//         });
//         alert('PIC Error: ' + error);
//       });
//   };

//   handleKirim = () => {
//     if (
//       this.state.ktaId == null ||
//       this.state.lokasiId == null ||
//       this.state.deptId == null ||
//       this.state.picId == null ||
//       !this.state.kodeBahaya ||
//       !this.state.status
//     ) {
//       Alert.alert(
//         'Oops!',
//         'Lengkapi isian.',
//         [
//           {
//             text: 'OK',
//             onPress: () => null,
//           },
//         ],
//         {onDismiss: () => null},
//       );
//     } else {
//       this.context.setLoading(true);

//       const {
//         ktaId,
//         // detailKta,
//         lokasiId,
//         // detailLokasi,
//         deptId,
//         picId,
//         kodeBahaya,
//         // status,
//         tindakanPerbaikan,
//         ktaOptions,
//         lokasiOptions,
//         deptOptions,
//         picOptions,
//       } = this.state;

//       var data = new FormData();
//       data.append('nrp', this.context.userData.nrp);
//       data.append('kta', ktaOptions[ktaId].code);
//       data.append('lokasi', lokasiOptions[lokasiId].code);
//       data.append('kode', kodeBahaya);
//       data.append('pic_dept', deptOptions[deptId].name);
//       data.append('pic_nrp', picOptions[picId].nrp);
//       data.append('perbaikan', tindakanPerbaikan);
//       data.append('is_public', this.context.isPublicNetwork);
//       data.append('evidence', {
//         uri: this.state.image.path,
//         type: this.state.image.mime,
//         name: 'image.jpg',
//       });

//       Axios.post(`/hazard`, data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       })

//         .then((response) => {
//           this.context.setLoading(false);

//           Alert.alert(
//             'Success',
//             `${response.data.message}`,
//             [
//               {
//                 text: 'OK',
//                 onPress: () => this.props.navigation.goBack(),
//               },
//             ],
//             {onDismiss: () => this.props.navigation.goBack()},
//           );
//         })
//         .catch((error) => {
//           this.context.setLoading(false);

//           Alert.alert(
//             'Oops!',
//             JSON.stringify(error),
//             [
//               {
//                 text: 'OK',
//                 onPress: () => null,
//               },
//             ],
//             {onDismiss: () => null},
//           );
//         });
//     }
//   };

//   pickImage = () => {
//     this.RBSheet.close();
//     ImagePicker.openPicker({
//       freeStyleCropEnabled: true,
//       cropping: true,
//       compressImageQuality: 0.1,
//     })
//       .then((image) => {
//         this.setState({image: image});
//       })
//       .catch(() => {});
//   };

//   takeImage = () => {
//     this.RBSheet.close();
//     ImagePicker.openCamera({
//       freeStyleCropEnabled: true,
//       cropping: true,
//     })
//       .then((image) => {
//         this.setState({image: image});
//       })
//       .catch(() => {});
//   };

//   render() {
//     return (
//       <>
//         <StatusBar
//           barStyle="light-content"
//           hidden={false}
//           translucent={false}
//           backgroundColor={'#0F4C75'}
//         />

//         <Appbar.Header style={{zIndex: 3}}>
//           <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
//           <Appbar.Content title="Laporan Bahaya" />
//         </Appbar.Header>

//         <View>
//           <TouchableOpacity
//             activeOpacity={0.75}
//             onPress={() => this.RBSheet.open()}>
//             <View
//               style={{
//                 height: height / 4,
//                 padding: 5,
//                 borderStyle: this.state.image == null ? 'dashed' : 'solid',
//                 borderRadius: 10,
//                 borderWidth: this.state.image == null ? 1.7 : 1,
//                 borderColor:
//                   this.state.image == null ? Colors.grey500 : Colors.grey500,
//                 backgroundColor:
//                   this.state.image == null ? Colors.grey200 : 'transparent',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               {this.state.image == null ? (
//                 <>
//                   <FeatherIcons
//                     name={'upload'}
//                     size={30}
//                     color={Colors.grey500}
//                   />
//                   <Text
//                     style={{
//                       fontSize: 17,
//                       color: Colors.grey500,
//                       marginTop: 5,
//                     }}>
//                     Unggah Bukti
//                   </Text>
//                 </>
//               ) : (
//                 <Image
//                   style={{
//                     flex: 1,
//                     width: '100%',
//                     height: '120%',
//                     resizeMode: 'cover',
//                     borderRadius: 10,
//                   }}
//                   source={{
//                     uri: this.state.image.path,
//                     // width: 100,
//                     // height: 100,
//                   }}
//                 />
//               )}
//             </View>
//           </TouchableOpacity>

//           <RBSheet
//             customStyles={{
//               container: {
//                 borderRadius: 10,
//                 width: (width * 2) / 3,
//                 bottom: (height * 3) / 5,
//                 left: width / 6,
//                 backgroundColor: 'transparent',
//                 // backgroundColor:"white"
//               },
//             }}
//             animationType={'fade'}
//             height={height / 6}
//             closeOnDragDown
//             ref={(ref) => {
//               this.RBSheet = ref;
//             }}>
//             {/* <View
//             style={{
//               justifyContent: "center",
//               alignItems: "center",
//               height: 25,
//               borderTopRightRadius: 35,
//               marginBottom: 10,
//             }}
//           >
//             <FeatherIcons name="minus" size={50} color={color="black"} />
//           </View> */}
//             <View
//               style={{
//                 flexDirection: 'column',
//                 // marginHorizontal: 20,
//                 marginBottom: 20,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 flex: 1,
//               }}>
//               <TouchableOpacity
//                 activeOpacity={0.75}
//                 style={{
//                   flex: 1,
//                 }}
//                 onPress={this.takeImage}>
//                 <View
//                   style={{
//                     flex: 1,
//                     // backgroundColor: "#07689f",
//                     backgroundColor: 'transparent',
//                     borderRadius: 10,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}>
//                   <View style={{flexDirection: 'row'}}>
//                     <FeatherIcons name="camera" size={80} color={'#2D4059'} />
//                   </View>
//                 </View>
//               </TouchableOpacity>
//               {/* <View style={{ width: 15 }} />
//             <TouchableOpacity
//               activeOpacity={0.75}
//               style={{
//                 flex: 1,
//               }}
//               onPress={this.pickImage}
//             > */}
//               {/* <View
//                 style={{
//                   flex: 1,
//                   backgroundColor: Colors.cyan400,
//                   borderRadius: 10,
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <FeatherIcons name="image" size={75} color={Colors.white} />
//               </View> */}
//               {/* </TouchableOpacity> */}
//             </View>
//           </RBSheet>
//         </View>

//         <View style={{flex: 1}}>
//           {this.state.loading ? (
//             <LoadingIndicator />
//           ) : this.state.requestError ? (
//             <ErrorData onRetry={this.getHazardData} />
//           ) : (
//             <>
//               <ScrollView style={{flex: 1, backgroundColor: Colors.grey100}}>
//                 <View
//                   style={{
//                     paddingHorizontal: 20,
//                     paddingTop: 10,
//                     backgroundColor: Colors.white,
//                   }}>
//                   <InputOption
//                     label="Lokasi"
//                     mode="contained"
//                     value={
//                       this.state.lokasiId != null &&
//                       this.state.lokasiOptions[this.state.lokasiId].name
//                     }
//                     optionData={this.state.lokasiOptions}
//                     useIndexReturn={true}
//                     onOptionChoose={(val) => this.setState({lokasiId: val})}
//                     hasHelper={false}
//                     style={{
//                       marginBottom: 5,
//                       backgroundColor: 'transparent',
//                       borderWidth: 0,
//                       color: 'yellow',
//                     }}
//                   />

//                   {this.state.lokasiId != null && (
//                     <TextInput
//                       // mode="outlined"
//                       mode="contained"
//                       style={{
//                         marginbottom: 5,
//                         backgroundColor: 'transparent',
//                         color: Colors.blue700,
//                       }}
//                       label="Detail Lokasi"
//                       placeholder="Isikan lokasi kejadian"
//                       value={this.state.detailLokasi}
//                       onChangeText={(text) =>
//                         this.setState({detailLokasi: text})
//                       }
//                     />
//                   )}

//                   {this.state.lokasiId != null && (
//                     <InputOption
//                       label="Kategori"
//                       value={
//                         this.state.ktaId != null &&
//                         this.state.ktaOptions[this.state.ktaId].name
//                       }
//                       optionData={this.state.ktaOptions}
//                       useIndexReturn={true}
//                       onOptionChoose={(val) => this.setState({ktaId: val})}
//                       hasHelper={false}
//                       style={{
//                         marginbottom: 5,
//                         backgroundColor: 'transparent',
//                         borderWidth: 0,
//                         color: Colors.blue700,
//                       }}
//                       isSearchable={true}
//                     />
//                   )}

//                   {this.state.ktaId != null && (
//                     <TextInput
//                       // mode="outlined"
//                       mode="contained"
//                       style={{
//                         marginbottom: 5,
//                         backgroundColor: 'transparent',
//                         color: Colors.blue700,
//                       }}
//                       label="Detail KTA"
//                       placeholder="Kodisi atau tidakan tidak aman yang ditemui"
//                       value={this.state.detailKta}
//                       onChangeText={(text) => this.setState({detailKta: text})}
//                     />
//                   )}

//                   {this.state.ktaId != null && (
//                     <InputOption
//                       mode="contained"
//                       label="Kepada Dept "
//                       value={
//                         this.state.deptId != null &&
//                         this.state.deptOptions[this.state.deptId].name
//                       }
//                       optionData={this.state.deptOptions}
//                       useIndexReturn={true}
//                       onOptionChoose={(val) => this.handleSetDept(val)}
//                       hasHelper={false}
//                       style={{
//                         marginbottom: 5,
//                         backgroundColor: 'transparent',
//                         borderWidth: 0,
//                         color: Colors.blue700,
//                       }}
//                     />
//                   )}

//                   {this.state.deptId != null && (
//                     <InputOption
//                       label="PIC"
//                       value={
//                         this.state.picId != null &&
//                         this.state.picOptions[this.state.picId].name
//                       }
//                       optionData={this.state.picOptions}
//                       useIndexReturn={true}
//                       onOptionChoose={(val) => this.setState({picId: val})}
//                       hasHelper={false}
//                       style={{
//                         marginbottom: 5,
//                         borderWidth: 0,
//                         backgroundColor: 'transparent',
//                         color: Colors.blue700,
//                       }}
//                       isLoading={this.state.isPicLoading}
//                       isSearchable={true}
//                     />
//                   )}

//                   {this.state.picId != null && (
//                     <InputOption
//                       label="Kode Bahaya"
//                       value={this.state.kodeBahaya}
//                       optionData={[
//                         {
//                           name: 'High',
//                           value: 'H',
//                           mcIcon: 'circle-slice-8',
//                         },
//                         // {
//                         //   name: "Severity",
//                         //   value: "S",
//                         //   mcIcon: "circle-slice-6",
//                         // },
//                         {
//                           name: 'Medium',
//                           value: 'M',
//                           mcIcon: 'circle-slice-4',
//                         },
//                         {
//                           name: 'Low',
//                           value: 'L',
//                           mcIcon: 'circle-slice-2',
//                         },
//                       ]}
//                       onOptionChoose={(val) => this.setState({kodeBahaya: val})}
//                       hasHelper={false}
//                       style={{
//                         marginbottom: 5,
//                         borderWidth: 0,
//                         backgroundColor: 'transparent',
//                         color: Colors.blue700,
//                       }}
//                     />
//                   )}

//                   {this.state.picId != null && (
//                     <TextInput
//                       // mode="outlined"
//                       mode="contained"
//                       multiline
//                       style={{
//                         marginbottom: 5,
//                         backgroundColor: 'transparent',
//                       }}
//                       label="Tindakan Perbaikan"
//                       placeholder="Tindakan Perbaikan"
//                       value={this.state.tindakanPerbaikan}
//                       onChangeText={(text) =>
//                         this.setState({tindakanPerbaikan: text})
//                       }
//                     />
//                   )}

//                   {this.state.picId != null && (
//                     <InputOption
//                       label="Status"
//                       value={this.state.status}
//                       optionData={[
//                         {name: 'Open', mcIcon: 'package-variant'},
//                         {
//                           name: 'Close',
//                           mcIcon: 'package-variant-closed',
//                         },
//                       ]}
//                       onOptionChoose={(val) => this.setState({status: val})}
//                       hasHelper={false}
//                       style={{
//                         marginbottom: 5,
//                         borderWidth: 0,
//                         backgroundColor: 'transparent',
//                         color: Colors.blue700,
//                       }}
//                     />
//                   )}
//                 </View>

//                 <View
//                   style={{
//                     backgroundColor: Colors.white,
//                     height: 5,
//                   }}
//                 />
//                 <View
//                   style={{
//                     backgroundColor: Colors.grey300,
//                     height: 1,
//                   }}
//                 />
//                 <View
//                   style={{
//                     backgroundColor: Colors.grey100,
//                     height: 50,
//                     // marginBottom: 10,
//                   }}
//                 />
//                 {this.state.keyboardState == 'closed' &&
//                   this.state.status != '' && (
//                     <TouchableNativeFeedback onPress={this.handleKirim}>
//                       <View
//                         style={{
//                           height: 50,
//                           backgroundColor: Colors.orange700,
//                           justifyContent: 'center',
//                           alignItems: 'center',
//                           // marginTop: 10,
//                         }}>
//                         <Title style={{color: Colors.white}}>Submit</Title>
//                       </View>
//                     </TouchableNativeFeedback>
//                   )}
//               </ScrollView>

//               {/* {this.state.keyboardState == "closed" && (
//                 <TouchableNativeFeedback onPress={this.handleKirim}>
//                   <View
//                     style={{
//                       height: 50,
//                       backgroundColor: Colors.orange700,
//                       justifyContent: "center",
//                       alignItems: "center",
//                       // marginTop: 10,
//                     }}
//                   >
//                     <Title style={{ color: Colors.white,borderRadius:20 }}>Kirim</Title>
//                   </View>
//                 </TouchableNativeFeedback>
//               )} */}
//             </>
//           )}
//         </View>

//         <Modal
//           isVisible={this.context.isLoading}
//           style={{justifyContent: 'center', alignItems: 'center'}}>
//           <View
//             style={{
//               backgroundColor: Colors.white,
//               borderRadius: 10,
//               justifyContent: 'center',
//               alignItems: 'center',
//               padding: 20,
//             }}>
//             <ActivityIndicator
//               size="large"
//               animating={true}
//               color={Colors.red800}
//             />
//             <Text style={{marginTop: 15}}>Loading...</Text>
//           </View>
//         </Modal>
//       </>
//     );
//   }
// }

// HazardScreen.contextType = AppContext;

// export default HazardScreen;
