import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default class BlinkingText extends Component {
  constructor(props) {
    super(props);
    this.state = {showText: true};

    // Change the state every second
    setInterval(
      () => {
        this.setState((previousState) => {
          return {showText: !previousState.showText};
        });
      },
      // Define any blinking time.
      500,
    );
  }

  render() {
    let display = this.state.showText ? this.props.text : '  ';
    return (
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: 'red',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          marginBottom: 3,
        }}>
        <Text
          style={{
            borderRadius: 13,
            fontWeight: 'bold',
            fontSize: 13,
            backgroundColor: 'red',
            color: 'white',
          }}>
          {display}
        </Text>
      </View>
    );
  }
}
