import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {AppContext} from '../context';
import {NumericInput} from '../components';
import {colors} from '../styles';

export default class Volume extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.val !== nextProps.val;
  }

  _changeText = (key) => {
    let volume;
    if (key === 'C') {
      volume = null;
    } else {
      volume = this.props.val ? this.props.val + key : key;
    }

    this.props.onSet(volume);
    // this.context.setState({volume: volume});
  };

  render() {
    return (
      <NumericInput
        inputVal={this.props.val}
        title={'Volume'}
        subtitle={'Liter'}
        color={colors.lightred}
        onKeyPress={this._changeText}
      />
    );
  }
}
Volume.contextType = AppContext;
