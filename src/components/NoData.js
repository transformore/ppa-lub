import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Caption} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

const NoData = () => {
  return (
    <View style={styles.container}>
      <Caption>No data</Caption>
    </View>
  );
};

export default NoData;
