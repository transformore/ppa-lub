import React from 'react';
import {View, Text, TouchableNativeFeedback} from 'react-native';
import {Card, List} from 'react-native-paper';
import {colors} from '../styles';

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
          <Card
            style={{flex: 1, margin: 3, marginHorizontal: 15, maxHeight: 100}}>
            <View style={{flex: 1}} />
            <List.Item
              title={
                props.idleVal == null ? `No ${props.idleTitle}` : props.idleVal
              }
              description={props.idleTitle}
              left={(prop) => (
                <List.Icon {...prop} icon={props.icon} color={props.color} />
              )}
              right={(prop) => <List.Icon {...prop} icon={'chevron-right'} />}
            />
            <View style={{flex: 1}} />
          </Card>
        </TouchableNativeFeedback>
      </View>
    );
  }
};

export default AutoResizeCard;
