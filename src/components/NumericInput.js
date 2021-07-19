import React from 'react';
import {View, Text, TouchableNativeFeedback, StyleSheet} from 'react-native';
import {Divider, TouchableRipple} from 'react-native-paper';
import {colors} from '../styles';

const NumericInput = (props) => {
  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            paddingVertical: 15,
            paddingHorizontal: 25,
          }}>
          <Text
            style={
              props.inputVal ? {fontSize: 30} : {fontSize: 30, color: 'gray'}
            }>
            {' '}
            {props.inputVal ? props.inputVal : props.title}{' '}
          </Text>
        </View>
      </View>
      <Divider />
      {/* button */}
      <View style={{flex: 1}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.orange)}
            onPress={() => props.onKeyPress('7')}>
            <View style={styles.numberkey}>
              <Text
                style={{
                  fontSize: 40,
                  borderRadius: 10,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                7
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.grey)}
            onPress={() => props.onKeyPress('8')}>
            <View style={styles.numberkey}>
              <Text style={{fontSize: 40}}>8</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.grey)}
            onPress={() => props.onKeyPress('9')}>
            <View style={styles.numberkey}>
              <Text style={{fontSize: 40}}>9</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.grey)}
            onPress={() => props.onKeyPress('4')}>
            <View style={styles.numberkey}>
              <Text style={{fontSize: 40}}>4</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.grey)}
            onPress={() => props.onKeyPress('5')}>
            <View style={styles.numberkey}>
              <Text style={{fontSize: 40}}>5</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.grey)}
            onPress={() => props.onKeyPress('6')}>
            <View style={styles.numberkey}>
              <Text style={{fontSize: 40}}>6</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.grey)}
            onPress={() => props.onKeyPress('1')}>
            <View style={styles.numberkey}>
              <Text style={{fontSize: 40}}>1</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.grey)}
            onPress={() => props.onKeyPress('2')}>
            <View style={styles.numberkey}>
              <Text style={{fontSize: 40}}>2</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.grey)}
            onPress={() => props.onKeyPress('3')}>
            <View style={styles.numberkey}>
              <Text style={{fontSize: 40}}>3</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.grey)}
            onPress={() => props.onKeyPress('.')}>
            <View style={styles.dotkey}>
              <Text style={{fontSize: 40}}>.</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.grey)}
            onPress={() => props.onKeyPress('0')}>
            <View style={styles.zerokey}>
              <Text style={{fontSize: 40}}>0</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.lightred)}
            onPress={() => props.onKeyPress('C')}>
            <View style={styles.ckey}>
              <Text style={{fontSize: 40}}>C</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  numberkey: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: '#7f8fa6',
  },
  zerokey: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: '#dcdde1',
  },
  dotkey: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#dcdde1',
    // borderColor: 'grey',
  },
  ckey: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: 'orange',
  },
});
export default NumericInput;
