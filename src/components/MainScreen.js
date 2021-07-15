// import {
//   StyleSheet,
//   View,
//   StatusBar,
//   ScrollView,
//   FlatList,
//   KeyboardAvoidingView,
//   PermissionsAndroid,
//   Platform,
// } from "react-native";
// import {
//   Provider as PaperProvider,
//   Button,
//   Text,
//   Card,
//   Snackbar,
//   Dialog,
//   Portal,
//   List,
//   Divider,
//   Avatar,
//   Colors,
// } from "react-native-paper";
// import AsyncStorage from "@react-native-community/async-storage";

// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import RBSheet from "react-native-raw-bottom-sheet";
// import {
//   Header,
//   Unit,
//   Location,
//   Volume,
//   History,
//   AutoResizeCard,
// } from "../components";
// import API from "../api";
// import { colors } from "../styles";
// import { CameraKitCameraScreen } from "react-native-camera-kit";
// import axios from "axios";
// import { withNavigation } from "react-navigation";
// import { AppContext } from "../context";
// import FeatherIcons from "react-native-vector-icons/Feather";

// class MainPHONE extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       unit: null,
//       volume: null,
//       location: null,

//       sendMessageVisible: false,
//       sendMessage: "",
//       sendConfirmationDialogVisible: false,
//       sendHeaderLoadingVisible: false,

//       historyDialogVisible: false,

//       nrp: "",
//       nama: "",
//       ft: "",

//       selectedCard: null,
//     };
//   }

//   componentDidMount() {
//     this.setState({ sendHeaderLoadingVisible: true });
//     this._getDataAsync();
//   }

//   _getDataAsync = async () => {
//     const value = await AsyncStorage.getItem("userToken");
//     axios
//       .post(`/home/validate`, {
//         token: await value,
//       })
//       .then((response) => {
//         this.setState({
//           nrp: response.data.data.nrp,
//           nama: response.data.data.nama,
//           ft: response.data.data.ft,
//           sendHeaderLoadingVisible: false,
//         });
//       })
//       .catch((error) => {
//         if (error.response.status == 401) {
//           alert("Unauthorized access!");
//           this.setState({
//             sendHeaderLoadingVisible: false,
//           });
//         } else {
//           alert(error);
//           this.setState({
//             sendHeaderLoadingVisible: false,
//           });
//         }
//         this._logoutAsync();
//       });
//   };

//   _logoutAsync = async () => {
//     await AsyncStorage.clear();
//     this.props.navigation.navigate("Auth");
//   };

//   _setUnit = (val) => this.setState({ unit: val });

//   _setLocation = (val) => this.setState({ location: val });

//   _setVolume = (val) => this.setState({ volume: val });

//   _showSendConfirmationDialog = () =>
//     this.setState({ sendConfirmationDialogVisible: true });

//   _hideSendConfirmationDialog = () =>
//     this.setState({ sendConfirmationDialogVisible: false });

//   _showHistoryDialog = () => this.setState({ historyDialogVisible: true });

//   _hideHistoryDialog = () =>
//     this.setState({ historyDialogVisible: false, selectedCard: null });

//   _sendRefuelingData = () => {
//     this.setState({ sendHeaderLoadingVisible: true });
//     this._hideSendConfirmationDialog();
//     axios
//       .post(`/home`, {
//         nrp: this.state.nrp,
//         ft: this.state.ft,
//         cn: this.state.unit,
//         volume: parseFloat(this.state.volume),
//         lokasi: this.state.location,
//       })
//       .then((response) => {
//         this.setState({
//           sendMessage: "Success... Your data has been submitted!",
//           sendMessageVisible: true,
//           sendHeaderLoadingVisible: false,
//           selectedCard: null,
//           unit: null,
//           volume: null,
//           location: null,
//         });
//       })
//       .catch((error) => {
//         this.setState({
//           sendMessage: "Error... Something has gone wrong!",
//           sendMessageVisible: true,
//           sendHeaderLoadingVisible: false,
//         });
//       });
//   };

//   _openUnitScanner() {
//     var that = this;
//     //To Start Scanning
//     if (Platform.OS === "android") {
//       async function requestCameraPermission() {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: "Refueling App Camera Permission",
//               message: "Refueling App needs access to your camera ",
//             }
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             //If CAMERA Permission is granted
//             that.setState({ unit: "" });
//             that.props.navigation.navigate("QRScan", {
//               setUnit: that._setUnit,
//             });
//           } else {
//             alert("CAMERA permission denied");
//           }
//         } catch (err) {
//           alert("Camera permission err", err);
//           console.warn(err);
//         }
//       }
//       //Calling the camera permission function
//       requestCameraPermission();
//     } else {
//       that.setState({ unit: "" });
//       that.props.navigation.navigate("QRScan");
//     }
//   }

//   _selectCard = (id) => {
//     this.setState({ selectedCard: id });
//   };

//   render() {
//     return (
//       <View style={{ flex: 1, backgroundColor: "#fbd0d1" }}>
//         <Header
//           showSend={
//             this.state.location != null &&
//             this.state.unit != null &&
//             this.state.volume != null
//           }
//           onSend={this._showSendConfirmationDialog}
//           loading={this.state.sendHeaderLoadingVisible}
//           data={{
//             nrp: this.state.nrp,
//             nama: this.state.nama,
//             ft: this.state.ft,
//           }}
//         />
//         <View style={{ flex: 1, margin: 5, marginVertical: 15 }}>
//           <AutoResizeCard
//             selected={this.state.selectedCard}
//             id={1}
//             onPress={() => this._selectCard(1)}
//             icon={"local-shipping"}
//             idleVal={this.state.unit}
//             idleTitle={"Unit"}
//             color={colors.blue}
//           >
//             <Unit
//               val={this.state.unit}
//               onSet={this._setUnit}
//               onScan={() => this._openUnitScanner()}
//               ref="unitRef"
//               {...this.props}
//             />
//           </AutoResizeCard>
//           <AutoResizeCard
//             selected={this.state.selectedCard}
//             id={2}
//             onPress={() => this._selectCard(2)}
//             icon={"place"}
//             idleVal={this.state.location}
//             idleTitle={"Location"}
//             color={colors.red}
//           >
//             <Location
//               val={this.state.location}
//               onSet={this._setLocation}
//               ref="locationRef"
//               {...this.props}
//             />
//           </AutoResizeCard>
//           <AutoResizeCard
//             selected={this.state.selectedCard}
//             id={3}
//             onPress={() => this._selectCard(3)}
//             icon={"opacity"}
//             idleVal={this.state.volume}
//             idleTitle={"Volume"}
//             color={colors.yellow}
//           >
//             <Volume
//               val={this.state.volume}
//               onSet={this._setVolume}
//               ref="volumeRef"
//               {...this.props}
//             />
//           </AutoResizeCard>

//           {this.state.selectedCard ? null : <View style={{ flex: 1 }} />}

//           <Button
//             color={Colors.amber800}
//             style={{ margin: 3, marginHorizontal: 15, marginTop: 10 }}
//             mode={"contained"}
//             icon={"history"}
//             onPress={this._showHistoryDialog}
//           >
//             History
//           </Button>
//           <Button
//             color={"#000"}
//             style={{ margin: 3, marginHorizontal: 15 }}
//             mode={"contained"}
//             icon={"settings"}
//             onPress={() => this.RBSheet.open()}
//           >
//             Settings
//           </Button>
//         </View>

//         <Snackbar
//           visible={this.state.sendMessageVisible}
//           onDismiss={() => this.setState({ sendMessageVisible: false })}
//           action={{
//             label: "Close",
//             onPress: () => {
//               // Do something
//             },
//           }}
//         >
//           {this.state.sendMessage}
//         </Snackbar>

//         <Portal>
//           <Dialog
//             visible={this.state.sendConfirmationDialogVisible}
//             onDismiss={this._hideSendConfirmationDialog}
//           >
//             <Dialog.Title>Refueling Confirmation</Dialog.Title>
//             <Dialog.Content>
//               <List.Item
//                 title={`Fuel Truck: ${this.state.ft}`}
//                 left={(props) => <List.Icon {...props} icon="local-shipping" />}
//               />
//               <List.Item
//                 title={`Unit: ${this.state.unit}`}
//                 left={(props) => (
//                   <List.Icon {...props} icon="airline-seat-recline-normal" />
//                 )}
//               />
//               <List.Item
//                 title={`Location: ${this.state.location}`}
//                 left={(props) => <List.Icon {...props} icon="place" />}
//               />
//               <List.Item
//                 title={`Volume: ${this.state.volume} liter`}
//                 left={(props) => <List.Icon {...props} icon="opacity" />}
//               />
//             </Dialog.Content>
//             <Dialog.Actions>
//               <Button
//                 color={"#000000"}
//                 onPress={this._hideSendConfirmationDialog}
//               >
//                 Cancel
//               </Button>
//               <Button color={"#000000"} onPress={this._sendRefuelingData}>
//                 Confirm
//               </Button>
//             </Dialog.Actions>
//           </Dialog>

//           <Dialog
//             style={{ flex: 1 }}
//             visible={this.state.historyDialogVisible}
//             onDismiss={this._hideHistoryDialog}
//           >
//             <History nrp={this.state.nrp} ref="historyRef" {...this.props} />
//             <Dialog.Actions>
//               <Button color={"#000000"} onPress={this._hideHistoryDialog}>
//                 Close
//               </Button>
//             </Dialog.Actions>
//           </Dialog>
//         </Portal>

//         <RBSheet
//           animationType={"fade"}
//           closeOnDragDown
//           height={250}
//           duration={500}
//           ref={(ref) => {
//             this.RBSheet = ref;
//           }}
//           // customStyles={{
//           //   container: {
//           //     justifyContent: "center",
//           //     alignItems: "center"
//           //   }
//           // }}
//         >
//           <View
//             style={{
//               justifyContent: "center",
//               alignItems: "center",
//               height: 30,
//             }}
//           >
//             <FeatherIcons name="minus" size={60} color={Colors.grey300} />
//           </View>
//           <View style={{ flex: 1 }} />
//           <Button
//             style={{
//               margin: 20,
//             }}
//             icon={"autorenew"}
//             mode="outlined"
//             color={Colors.black}
//             onPress={() => {
//               this.props.navigation.navigate("AuthLoading");
//             }}
//           >
//             Refresh
//           </Button>
//           <List.Item
//             title="Change Password"
//             description="Change your current password"
//             left={(props) => <List.Icon {...props} icon="lock" />}
//             right={(props) => <List.Icon {...props} icon="chevron-right" />}
//             onPress={() => {
//               this.RBSheet.close();
//               this.props.navigation.navigate("ChangePassword", {
//                 nrp: this.state.nrp,
//               });
//             }}
//           />
//           <Button
//             color={Colors.grey800}
//             style={{ margin: 20 }}
//             mode={"contained"}
//             onPress={this._logoutAsync}
//           >
//             Logout
//           </Button>
//         </RBSheet>
//       </View>
//     );
//   }
// }

// MainPHONE.contextType = AppContext;

// export default withNavigation(MainPHONE);
// [1:53 PM, 7/13/2021] Mochammad Suwito: import React, { Component } from "react";
// import {
// export default withNavigation(MainPHONE);
// [1:53 PM, 7/13/2021] Mochammad Suwito: import React, { Component } from "react";
// import {
//   StyleSheet,
//   View,
//   StatusBar,
//   ScrollView,
//   FlatList,
//   KeyboardAvoidingView,
//   PermissionsAndroid,
//   Platform
// } from "react-native";
// import {
//   Provider as PaperProvider,
//   Button,
//   Text,
//   Card,
//   Snackbar,
//   Dialog,
//   Portal,
//   List,
//   Divider
// } from "react-native-paper";
// import AsyncStorage from "@react-native-community/async-storage";

// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import RBSheet from "react-native-raw-bottom-sheet";
// import { Header, Unit, Location, Volume, History } from "../components";
// import API from "../api";
// import { colors } from "../styles";
// import { CameraKitCameraScreen } from "react-native-camera-kit";
// import axios from "axios";
// import { withNavigation } from "react-navigation";

// class MainTAB extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       unit: null,
//       volume: null,
//       location: null,

//       sendMessageVisible: false,
//       sendMessage: "",
//       sendConfirmationDialogVisible: false,
//       sendHeaderLoadingVisible: false,

//       nrp: "",
//       nama: "",
//       ft: ""
//     };
//   }

//   componentDidMount() {
//     this.setState({ sendHeaderLoadingVisible: true });
//     this._getDataAsync();
//   }

//   _getDataAsync = async () => {
//     const value = await AsyncStorage.getItem("userToken");
//     axios
//       .post(`/home/validate`, {
//         token: await value
//       })
//       .then(response => {
//         this.setState(
//           {
//             nrp: response.data.data.nrp,
//             nama: response.data.data.nama,
//             ft: response.data.data.ft,
//             sendHeaderLoadingVisible: false
//           },
//           () => this.refs.historyRef._refresh()
//         );
//       })
//       .catch(error => {
//         if (error.response.status == 401) {
//           alert("Unauthorized access!");
//           this.setState({
//             sendHeaderLoadingVisible: false
//           });
//         } else {
//           alert(error);
//           this.setState({
//             sendHeaderLoadingVisible: false
//           });
//         }
//         this._logoutAsync();
//       });
//   };

//   _logoutAsync = async () => {
//     await AsyncStorage.clear();
//     this.props.navigation.navigate("Auth");
//   };

//   _setUnit = val => this.setState({ unit: val });

//   _setLocation = val => this.setState({ location: val });

//   _setVolume = val => this.setState({ volume: val });

//   _showSendConfirmationDialog = () =>
//     this.setState({ sendConfirmationDialogVisible: true });

//   _hideSendConfirmationDialog = () =>
//     this.setState({ sendConfirmationDialogVisible: false });

//   _sendRefuelingData = () => {
//     this.setState({ sendHeaderLoadingVisible: true });
//     this._hideSendConfirmationDialog();
//     axios
//       .post(`/home`, {
//         nrp: this.state.nrp,
//         ft: this.state.ft,
//         cn: this.state.unit,
//         volume: parseFloat(this.state.volume),
//         lokasi: this.state.location
//       })
//       .then(response => {
//         this.setState({
//           sendMessage: "Success... Your data has been submitted!",
//           sendMessageVisible: true,
//           sendHeaderLoadingVisible: false
//         });
//         this.refs.historyRef._refresh();
//         this.refs.volumeRef._changeText("C");
//         this.refs.locationRef._resetData();
//         this.refs.unitRef._resetData();
//       })
//       .catch(error => {
//         this.setState({
//           sendMessage: "Error... Something has gone wrong!",
//           sendMessageVisible: true,
//           sendHeaderLoadingVisible: false
//         });
//       });
//   };

//   _openUnitScanner() {
//     var that = this;
//     //To Start Scanning
//     if (Platform.OS === "android") {
//       async function requestCameraPermission() {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: "Refueling App Camera Permission",
//               message: "Refueling App needs access to your camera "
//             }
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             //If CAMERA Permission is granted
//             that.setState({ unit: "" });
//             that.props.navigation.navigate("QRScan", {
//               setUnit: that._setUnit
//             });
//           } else {
//             alert("CAMERA permission denied");
//           }
//         } catch (err) {
//           alert("Camera permission err", err);
//           console.warn(err);
//         }
//       }
//       //Calling the camera permission function
//       requestCameraPermission();
//     } else {
//       that.setState({ unit: "" });
//       that.props.navigation.navigate("QRScan");
//     }
//   }

//   render() {
//     return (
//       <View style={{ flex: 1, backgroundColor: "#fbd0d1" }}>
//         <Header
//           showSend={
//             this.state.location != null &&
//             this.state.unit != null &&
//             this.state.volume != null
//           }
//           onSend={this._showSendConfirmationDialog}
//           loading={this.state.sendHeaderLoadingVisible}
//           data={{
//             nrp: this.state.nrp,
//             nama: this.state.nama,
//             ft: this.state.ft
//           }}
//         />
//         <View style={{ flex: 1, margin: 10 }}>
//           <View style={{ flex: 1, flexDirection: "row" }}>
//             <Card style={{ flex: 1, margin: 10 }}>
//               <Unit
//                 val={this.state.unit}
//                 onSet={this._setUnit}
//                 onScan={() => this._openUnitScanner()}
//                 ref="unitRef"
//                 {...this.props}
//               />
//             </Card>
//             <Card style={{ flex: 1, margin: 10 }}>
//               <Location
//                 val={this.state.location}
//                 onSet={this._setLocation}
//                 ref="locationRef"
//                 {...this.props}
//               />
//             </Card>
//           </View>
//           <View style={{ flex: 2, flexDirection: "row" }}>
//             <Card style={{ flex: 2, margin: 10 }}>
//               <Volume
//                 val={this.state.volume}
//                 onSet={this._setVolume}
//                 ref="volumeRef"
//                 {...this.props}
//               />
//             </Card>
//             <View style={{ flex: 1 }}>
//               <Card
//                 style={{
//                   flex: 1,
//                   margin: 10
//                 }}
//               >
//                 <History
//                   nrp={this.state.nrp}
//                   ref="historyRef"
//                   {...this.props}
//                 />
//               </Card>
//               <Button
//                 color={"#000"}
//                 style={{ margin: 10 }}
//                 mode={"contained"}
//                 icon={"settings"}
//                 onPress={() => this.RBSheet.open()}
//               >
//                 Settings
//               </Button>
//             </View>
//           </View>
//         </View>

//         <Snackbar
//           visible={this.state.sendMessageVisible}
//           onDismiss={() => this.setState(…
// [1:53 PM, 7/13/2021] Mochammad Suwito: import React from "react";
// import { Text, View, StyleSheet } from "react-native";
// import { Caption } from "react-native-paper";

// import { colors } from "../styles";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 20
//   }
// });

// const NoData = () => {
//   return (
//     <View style={styles.container}>
//       <Caption>No data</Caption>
//     </View>
//   );
// };

// export default NoData;
// [1:53 PM, 7/13/2021] Mochammad Suwito: import React from "react";
// import { View, Text, TouchableNativeFeedback } from "react-native";
// import { Divider, TouchableRipple } from "react-native-paper";
// import { colors } from "../styles";

// const NumericInput = props => {
//   return (
//     <View style={{ flex: 1 }}>
//       <View style={{ flexDirection: "row" }}>
//         <View
//           style={{
//             flex: 1,
//             alignItems: "flex-end",
//             paddingVertical: 15,
//             paddingHorizontal: 25
//           }}
//         >
//           <Text
//             style={
//               props.inputVal
//                 ? { fontSize: 30 }
//                 : { fontSize: 30, color: "gray" }
//             }
//           >
//             {" "}
//             {props.inputVal ? props.inputVal : props.title}{" "}
//           </Text>
//         </View>
//         <View
//           style={{
//             borderTopRightRadius: 5,
//             paddingVertical: 15,
//             paddingHorizontal: 25,
//             backgroundColor: props.color
//           }}
//         >
//           <Text style={{ fontSize: 30, color: "#fff" }}>{props.subtitle}</Text>
//         </View>
//       </View>
//       <Divider />
//       {/* button */}
//       <View style={{ flex: 1 }}>
//         <View style={{ flex: 1, flexDirection: "row" }}>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.grey)}
//             onPress={() => props.onKeyPress("7")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>7</Text>
//             </View>
//           </TouchableNativeFeedback>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.grey)}
//             onPress={() => props.onKeyPress("8")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>8</Text>
//             </View>
//           </TouchableNativeFeedback>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.grey)}
//             onPress={() => props.onKeyPress("9")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>9</Text>
//             </View>
//           </TouchableNativeFeedback>
//         </View>
//         <View style={{ flex: 1, flexDirection: "row" }}>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.grey)}
//             onPress={() => props.onKeyPress("4")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>4</Text>
//             </View>
//           </TouchableNativeFeedback>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.grey)}
//             onPress={() => props.onKeyPress("5")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>5</Text>
//             </View>
//           </TouchableNativeFeedback>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.grey)}
//             onPress={() => props.onKeyPress("6")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>6</Text>
//             </View>
//           </TouchableNativeFeedback>
//         </View>
//         <View style={{ flex: 1, flexDirection: "row" }}>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.grey)}
//             onPress={() => props.onKeyPress("1")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>1</Text>
//             </View>
//           </TouchableNativeFeedback>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.grey)}
//             onPress={() => props.onKeyPress("2")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>2</Text>
//             </View>
//           </TouchableNativeFeedback>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.grey)}
//             onPress={() => props.onKeyPress("3")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>3</Text>
//             </View>
//           </TouchableNativeFeedback>
//         </View>
//         <View style={{ flex: 1, flexDirection: "row" }}>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.grey)}
//             onPress={() => props.onKeyPress(".")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>.</Text>
//             </View>
//           </TouchableNativeFeedback>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.grey)}
//             onPress={() => props.onKeyPress("0")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>0</Text>
//             </View>
//           </TouchableNativeFeedback>
//           <TouchableNativeFeedback
//             delayPressIn={0}
//             background={TouchableNativeFeedback.Ripple(colors.lightred)}
//             onPress={() => props.onKeyPress("C")}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center"
//               }}
//             >
//               <Text style={{ fontSize: 40 }}>C</Text>
//             </View>
//           </TouchableNativeFeedback>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default NumericInput;
// [1:53 PM, 7/13/2021] Mochammad Suwito: import React from "react";
// import { View, ScrollView, FlatList, RefreshControl } from "react-native";
// import {
//   Title,
//   Headline,
//   FAB,
//   Searchbar,
//   Divider,
//   List
// } from "react-native-paper";

// import { LoadingIndicator, NoData, ErrorData } from "../components";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// const SearchableList = props => {
//   if (props.selectedVal) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center"
//         }}
//       >
//         <Title>{props.title}</Title>
//         <Headline>{props.selectedVal}</Headline>
//         <FAB
//           style={{ marginTop: 10 }}
//           icon="mode-edit"
//           label={"CHANGE"}
//           theme={{ colors: { accent: "black" } }}
//           onPress={props.onReset}
//         />
//       </View>
//     );
//   } else {
//     return (
//       <View style={{ flex: 1 }}>
//         <Searchbar
//           icon={
//             props.scannable
//               ? ({ size, color }) => (
//                   <MaterialCommunityIcons
//                     name={"qrcode-scan"}
//                     size={size}
//                     color={color}
//                   />
//                 )
//               : "search"
//           }
//           onIconPress={props.scannable ? props.onScan : null}
//           style={{
//             elevation: 0,
//             borderBottomLeftRadius: 0,
//             borderBottomRightRadius: 0
//           }}
//           placeholder={`${props.title}`}
//           onChangeText={text => props.onChangeSearchText(text)}
//           blurOnSubmit={false}
//         />
//         <Divider />
//         {props.loading ? (
//           <LoadingIndicator />
//         ) : props.requestError ? (
//           <ErrorData onRetry={props.onRetry} />
//         ) : (
//           <View style={{ flex: 1 }}>
//             <ScrollView
//               keyboardShouldPersistTaps={"always"}
//               refreshControl={
//                 <RefreshControl
//                   refreshing={props.refreshing}
//                   onRefresh={props.onRefreshing}
//                 />
//               }
//             >
//               {!props.listData.length ? (
//                 <NoData />
//               ) : (
//                 <FlatList
//                   keyboardShouldPersistTaps={"always"}
//                   // style={{ backgroundColor: background }}
//                   data={props.listData}
//                   renderItem={({ item, index }) => (
//                     <List.Item
//                       title={item[Object.keys(item)[0]]}
//                       onPress={() => props.onSelect(item[Object.keys(item)[0]])}
//                     />
//                   )}
//                   keyExtractor={(item, index) => index.toString()}
//                   ItemSeparatorComponent={Divider}
//                 />
//               )}
//             </ScrollView>
//           </View>
//         )}
//       </View>
//     );
//   }
// };

// export default SearchableList;
// [1:54 PM, 7/13/2021] Mochammad Suwito: import React, { Component } from "react";
// import { Text, View } from "react-native";

// import { SearchableList } from "../components";
// import axios from "axios";
// import API from "../api";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// export default class Unit extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       listData: [],
//       loading: false,
//       refreshing: false,

//       requestError: false
//     };

//     this.listDataHolder = [];
//   }

//   componentDidMount() {
//     this._reload();
//   }

//   shouldComponentUpdate(nextProps, nextState) {
//     return this.props.val != nextProps.val || this.state != nextState;
//   }

//   _getListData = () => {
//     axios
//       .get(`/home/unit`)
//       .then(res …
// [2:13 PM, 7/13/2021] Mochammad Suwito: const colors = {
//   primary: "#F6685E",
//   primaryDark: "#F6685E",
//   deepgray: "#808080",
//   backgroundcolor: "#fcfcfc",
//   deeppurple: "#7c4dff",
//   yello: "#ffb300",
//   colorAccent: "#FF4081",
//   red: "#f34334",
//   lightred: "#F6685E",
//   blue: "#2196f5",
//   lightblue: "#66B4F6",
//   yellow: "#ff9801",
//   lightyellow: "#FFB549",
//   green: "#8cc34b",
//   lightgreen: "#AFD57F",
//   white: "#fff",
//   lighGrey: "#f5f5f5",
//   grey: "#bdbdbd"
// };

// export default colors;
// [2:17 PM, 7/13/2021] Mochammad Suwito: import React, { Component } from "react";
// import { Text, View } from "react-native";

// import { NumericInput } from "../components";
// import { colors } from "../styles";

// export default class Volume extends Component {
//   shouldComponentUpdate(nextProps, nextState) {
//     return this.props.val != nextProps.val;
//   }

//   _changeText = key => {
//     let volume;
//     if (key == "C") volume = null;
//     else volume = this.props.val ? this.props.val + key : key;

//     this.props.onSet(volume);
//   };

//   render() {
//     return (
//       <NumericInput
//         inputVal={this.props.val}
//         title={"Volume"}
//         subtitle={"Liter"}
//         color={colors.lightred}
//         onKeyPress={this._changeText}
//       />
//     );
//   }
// }
