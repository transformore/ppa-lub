import {DefaultTheme, Colors} from 'react-native-paper';

const paperTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.yellow100,
    accent: '#f1c40f',
  },
};

export default paperTheme;
