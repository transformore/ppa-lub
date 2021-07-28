import React from 'react';
import {View, Text, TouchableNativeFeedback} from 'react-native';
import {Divider, TouchableRipple} from 'react-native-paper';
import {colors} from '../styles';
import {AppContext} from '../context';

setInterval(
  () => {
    this.setState((previousState) => {
      return {showText: !previousState.showText};
    });
  },
  // Define any blinking time.
  500,
);

const BlinkingFrame = (props) => {
  return setInterval(
    () => {
      <View
        style={{
          flexDirection: props.flexDirection,
          borderWidth: props.borderWidth,
          backgroundColor: props.backgroundColor,
          borderRadius: props.borderRadius,
        }}>
        />
        <Text>{props.text}</Text>
      </View>;
    },
    // Define any blinking time.
    500,
  );
};

const styles = {
  numberColor: {fontSize: 40, color: colors.white},
  numberPad: {
    width: 100,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.deepgray,
    // backgroundColor: colors.elusiveblue,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  cPad: {
    width: 100,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ss6orange,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  enterPad: {
    flex: 1,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ss6orange,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 5,
  },
};
BlinkingFrame.contextType = AppContext;
export default BlinkingFrame;
