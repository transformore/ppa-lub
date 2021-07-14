import React, {Component} from 'react';
import {Text, View, Alert} from 'react-native';
import Modal from 'react-native-modal';
import {Title, TextInput, Button, Colors, Divider} from 'react-native-paper';
import {AppContext} from '../context';
import BreakdownLocation from './BreakdownLocation';
import Axios from 'axios';

//API pelaporan BD
// http://1.1.1.6/api/ppa-employee-api/api/cico/breakdownReporting

export class ReportBreakdownDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: null,
      remark: null,
      hmbd: null,
    };
  }

  setLocation = (val) => {
    this.setState({location: val});
    console.log(val);
  };

  onConfirm = () => {
    this.context.setLoading(true);
    Axios.post(`/breakdownReporting`, {
      unit: this.context.status.unit,
      lokasi: this.state.location.id,
      remark: this.state.remark,
      hmbd: this.state.hmbd,
      nrp: this.context.userData.nrp,
    })
      .then((response) => {
        this.props.hideReportBreakdownDialog();
        this.setState({location: '', remark: '', hmbd: ''});
        this.context.setLoading(false);
        this.props.onSubmit();
        Alert.alert(response.data.message, response.data.message);
      })
      .catch((error) => {
        this.context.setLoading(false);
        alert(error);
      });
  };

  render() {
    return (
      <Modal
        isVisible={this.props.reportBreakdownDialogVisible}
        onBackButtonPress={this.props.hideReportBreakdownDialog}
        onBackdropPress={this.props.hideReportBreakdownDialog}
        animationIn="fadeInDown"
        animationOut="fadeOutUp">
        <View
          style={{
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              elevation: 5,
              padding: 15,
            }}>
            <Title>{this.context.status.unit} - Repair Request</Title>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.grey100,
            }}>
            <View style={{flex: 1}}>
              <BreakdownLocation
                val={this.state.location}
                onSet={this.setLocation}
              />
            </View>
            {this.state.location ? (
              <>
                <Divider />
                <View style={{backgroundColor: Colors.white}}>
                  <TextInput
                    style={{
                      borderRadius: 3,
                      margin: 10,
                    }}
                    mode="outlined"
                    label="Remark Description"
                    value={this.state.remark}
                    onChangeText={(text) => this.setState({remark: text})}
                    multiline={true}
                  />
                  <TextInput
                    style={{
                      borderRadius: 3,
                      margin: 10,
                    }}
                    mode="outlined"
                    label="Current HM"
                    value={this.state.hmbd}
                    onChangeText={(text) => this.setState({hmbd: text})}
                    keyboardType={'decimal-pad'}
                    multiline={true}
                  />
                </View>
              </>
            ) : null}
          </View>
          <Divider />
          <View
            style={{
              backgroundColor: Colors.white,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              flexDirection: 'row',
              padding: 10,
              justifyContent: 'flex-end',
            }}>
            <Button
              disabled={
                !this.state.location || !this.state.remark || !this.state.hmbd
              }
              onPress={this.onConfirm}
              mode={
                !this.state.location || !this.state.remark || !this.state.hmbd
                  ? 'text'
                  : 'contained'
              }>
              Confirm
            </Button>
            <Button onPress={this.props.hideReportBreakdownDialog} mode="text">
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

ReportBreakdownDialog.contextType = AppContext;

export default ReportBreakdownDialog;
