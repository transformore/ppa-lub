import React from 'react';
import {View, Text, TouchableNativeFeedback, Dimensions} from 'react-native';
import {Card, DefaultTheme, List} from 'react-native-paper';
import {colors} from '../styles';
const {width, height} = Dimensions.get('screen');
const h_margin = 15;
const AutoResizeCard = (props) => {
  if (props.selected === props.id) {
    return <Card style={{flex: 5, margin: 5}}>{props.children}</Card>;
  } else {
    return (
      <View>
        <TouchableNativeFeedback
          style={{borderRadius: 10}}
          delayPressIn={0}
          background={TouchableNativeFeedback.Ripple(colors.white)}
          onPress={props.onPress}>
          {/* <Card
            style={{
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 5,
              maxHeight: 50,
              // alignItems: 'flex-end',
            }}> */}
          {props.idleVal == null ? (
            <View style={styles.optionTextBorder}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flex: 1,
                }}>
                <Text style={styles.labelInactive}>QUANTITY </Text>
                <Text
                  style={{
                    width: 35,
                    textAlign: 'center',
                    fontSize: 20,
                    marginRight: 10,
                  }}>
                  :
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.disableBorder}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flex: 1,
                }}>
                <Text style={styles.labelActive}>QUANTITY </Text>
                <Text
                  style={{
                    width: 25,
                    textAlign: 'center',
                    fontSize: 20,
                    marginRight: 10,
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: 25,
                    marginRight: 15,
                  }}>
                  {props.idleVal} {props.idleTitle}
                </Text>
              </View>
            </View>
          )}
          {/* <List.Item
              style={{width: 360}}
              title={
                props.idleVal == null
                  ? ''
                  : `${props.idleVal} ${props.idleTitle}`
                // props.idleVal == null ? `No ${props.idleTitle}` : props.idleVal
              }
              // description={''}
              // description={props.idleTitle}
              left={(prop) => (
                <List.Icon {...prop} icon={props.icon} color={props.color} />
              )}
              right={(prop) => <List.Icon {...prop} icon={'chevron-right'} />}
            /> */}
          {/* <View style={{flex: 1}} /> */}
          {/* </Card> */}
          {/* </View> */}
        </TouchableNativeFeedback>
      </View>
    );
  }
};
const styles = {
  optionTextBorder: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderColor: '#F79F1F',
    backgroundColor: '#ffdd59',
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width - 2 * h_margin,
    height: 50,
    marginVertical: 5,
    elevation: 3,
  },
  disableBorder: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderColor: colors.grey,
    backgroundColor: colors.elusiveblue,
    borderWidth: 0.5,
    borderRadius: width / 16,
    width: width - 2 * h_margin,
    height: 50,
    marginVertical: 5,
    elevation: 3,
  },
  labelInactive: {
    color: DefaultTheme.colors.placeholder,
    fontSize: 16,
    marginHorizontal: 5,
    width: 115,
    textAlign: 'left',
    marginLeft: 15,
  },
  labelActive: {
    color: DefaultTheme.colors.placeholder,
    fontSize: 10,
    marginLeft: 15,
    width: 65,
  },
};

export default AutoResizeCard;
