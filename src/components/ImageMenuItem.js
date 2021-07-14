import React, {Component} from 'react';
import {View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import {Caption, Colors, TouchableRipple} from 'react-native-paper';
// import Student from "../assets/image/menu/student.png";

export class ImageMenuItem extends Component {
  render() {
    return (
      <TouchableRipple onPress={this.props.onPress}>
        <View
          style={{
            width: 60,
            color: Colors.orange500,
            alignItems: 'center',
            ...this.props.style,
          }}>
          <Image
            style={{
              width: 55,
              height: 55,
              resizeMode: 'contain',
              marginBottom: 1,
            }}
            source={this.props.image}
          />
          <Caption
            style={{
              textAlign: 'center',
              fontSize: 11,
              lineHeight: 15,
              // fontWeight: "bold",
              color: Colors.blueGrey700,
            }}>
            {this.props.label}
          </Caption>
        </View>
      </TouchableRipple>
    );
  }
}

export default ImageMenuItem;
