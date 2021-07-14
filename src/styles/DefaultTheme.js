/* @flow */

import {Colors, DefaultTheme} from 'react-native-paper';

export default {
  ...DefaultTheme,
  // dark: false,
  dark: true,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.red500,
    // primary: Colors.grey900,
    // accent: Colors.red500,
    accent: Colors.grey900,
    background: Colors.white,
    surface: Colors.white,
    error: '#B00020',
    text: Colors.black,
    // disabled: color(Colors.black)
    //   .alpha(0.26)
    //   .rgb()
    //   .string(),
    // placeholder: color(Colors.black)
    //   .alpha(0.54)
    //   .rgb()
    //   .string(),
    // backdrop: color(Colors.black)
    //   .alpha(0.5)
    //   .rgb()
    //   .string(),
    // notification: Colors.pinkA400
  },
  animation: {
    scale: 1.0,
  },
};
