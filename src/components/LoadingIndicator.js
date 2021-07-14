import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator, Colors} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LoadingIndicator = () => {
  // class LoadingIndicator extends Component {
  //   render() {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating size={'large'} color={Colors.red500} />
    </View>
  );
};
// }

export default LoadingIndicator;
