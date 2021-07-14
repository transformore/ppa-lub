import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  TouchableOpacity,
  styles,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimePicker = (width) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setDate(currentDate);
    setTime(currentDate);
    setShow(Platform.OS === 'ios' ? true : false);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const formatDate = (date, time) => {
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
  };
  const formatTime = (time) => {
    return `${time.getHours()}:${time.getMinutes()}`;
  };

  return (
    <View
      style={{
        height: 50,
        borderRadius: 20,
        borderColor: 'grey50',
        borderWidth: 0.5,
        backgroundColor: 'yellow',
        width: width.width,
        // marginHorizontal: 25,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TouchableOpacity onPress={showTimepicker}>
        {/* <Text>{date}</Text> */}
        <Text style={{fontSize: 18}}>{formatTime(time)}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default TimePicker;
