import React from 'react';
import {View, Text, TouchableNativeFeedback} from 'react-native';
import {Divider, TouchableRipple} from 'react-native-paper';
import {colors} from '../styles';
import {AppContext} from '../context';
import Icon from 'react-native-vector-icons/AntDesign';

const setSelectedCard = () => {
  let card = 5;
  return this.context.setSelectedCard(card);
};
const NumericInput = (props) => {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          borderWidth: 10,
          backgroundColor: 'black',
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            paddingVertical: 5,
            paddingHorizontal: 12,
            backgroundColor: colors.cloud,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
          }}>
          <Text style={props.inputVal ? {fontSize: 40} : {fontSize: 30}}>
            {props.inputVal ? props.inputVal : props.title}
          </Text>
        </View>
        <View
          style={{
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            paddingVertical: 15,
            paddingHorizontal: 25,
            backgroundColor: props.color,
          }}>
          <Text style={{fontSize: 25, color: '#fff'}}>{props.subtitle}</Text>
        </View>
      </View>
      {/* <Divider /> */}
      <View style={{flex: 1, backgroundColor: 'black', padding: 15}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('7')}>
            <View style={styles.numberPad}>
              <Text style={styles.numberColor}>7</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('8')}>
            <View style={styles.numberPad}>
              <Text style={styles.numberColor}>8</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('9')}>
            <View style={styles.numberPad}>
              <Text style={styles.numberColor}>9</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('4')}>
            <View style={styles.numberPad}>
              <Text style={styles.numberColor}>4</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('5')}>
            <View style={styles.numberPad}>
              <Text style={styles.numberColor}>5</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('6')}>
            <View style={styles.numberPad}>
              <Text style={styles.numberColor}>6</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('1')}>
            <View style={styles.numberPad}>
              <Text style={styles.numberColor}>1</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('2')}>
            <View style={styles.numberPad}>
              <Text style={styles.numberColor}>2</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('3')}>
            <View style={styles.numberPad}>
              <Text style={styles.numberColor}>3</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('.')}>
            <View style={styles.numberPad}>
              <Text style={{fontSize: 40, color: colors.white}}> . </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('0')}>
            <View style={styles.numberPad}>
              <Text style={{fontSize: 40, color: colors.white}}>0</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.lightred)}
            onPress={() => props.onKeyPress('C')}>
            <View style={styles.cPad}>
              <Text style={{fontSize: 40, color: colors.white}}>C</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: 10,
          }}>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.deeppurple)}
            onPress={() => props.onKeyPress('00')}>
            <View style={styles.numberPad}>
              <Text style={{fontSize: 40, color: colors.white}}>00</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(colors.lightred)}
            onPress={() => props.enterPress(5)}>
            <View style={styles.enterPad}>
              {/* <Text style={{fontSize: 40}}>ENTER</Text> */}
              <Icon
                style={{margin: 10}}
                name="enter"
                size={35}
                color={colors.white}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
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
NumericInput.contextType = AppContext;
export default NumericInput;
