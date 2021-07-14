import {DefaultTheme, Colors} from 'react-native-paper';

const darkTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'transparent',
    accent: '#F79F1F',
    text: Colors.blueGrey900,
  },
};

export default darkTheme;
