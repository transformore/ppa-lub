import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Caption, Button} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ErrorData = (props) => {
  return (
    <View style={styles.container}>
      <Icon name="sentiment-dissatisfied" size={60} />
      <Caption>Something went wrong!</Caption>
      <Button color={'#000'} onPress={props.onRetry}>
        Retry
      </Button>
    </View>
  );
};

export default ErrorData;
