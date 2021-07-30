import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Text,
  Button,
} from 'react-native';

export default class Bounce extends React.Component {
  state = {
    animation: new Animated.Value(150),
  };

  componentDidMount = () => {
    Animated.spring(this.state.animation, {
      toValue: 250,
      duration: 2000,
      friction: 1,
      tension: 20,
      useNativeDriver: true,
    }).start();
  };
  handlePress = () => {
    alert('pushed !!');
    Animated.spring(this.state.animation, {
      toValue: 250,
      duration: 2000,
      friction: 1,
      tension: 20,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const trans = {
      transform: [{translateY: this.state.animation}],
    };

    return (
      <>
        <Animated.View style={[styles.ball, trans]}>
          <Text>Bola</Text>
        </Animated.View>
        {/* <View style={styles.container}>
          <TouchableOpacity onPress={this.handlePress} style={styles.button} />
          <Button title={'Push'} onPress={this.handlePress} />
        </View> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  ball: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'tomato',
    position: 'absolute',
    left: 160,
    top: 150,
  },
  button: {
    width: 150,
    height: 70,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fc5c65',
    marginVertical: 50,
  },
  container: {
    // flex: 1,
    height: 700,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
