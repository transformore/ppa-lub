import React, {Component, createRef} from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  DefaultTheme,
  HelperText,
  Portal,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  List,
  Colors,
  ActivityIndicator,
  Searchbar,
} from 'react-native-paper';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import {NoData} from '../components';

export class InputOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      searchbarText: '',
      searchableList: [],
    };
  }

  componentDidMount() {
    if (this.props.isSearchable) {
      this.setState({searchableList: this.props.optionData});
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isSearchable &&
      prevProps.optionData !== this.props.optionData
    ) {
      this.setState({searchableList: this.props.optionData});
    }
  }

  setIsModalVisible = (isVisible) => {
    if (this.props.isSearchable) {
      this.setState(
        isVisible
          ? {
              isModalVisible: isVisible,
              searchableList: this.props.optionData,
              searchbarText: '',
            }
          : {
              isModalVisible: isVisible,
            },
      );
    } else {
      this.setState({isModalVisible: isVisible});
    }
  };

  toggleModal = () => {
    // this.setIsModalVisible(!this.state.isModalVisible);
    setTimeout(() => {
      this.setIsModalVisible(!this.state.isModalVisible);
    }, 100);
    // alert(this.state.isModalVisible);
  };

  handleOptionChoose = (value) => {
    this.props.onOptionChoose(value);
    this.setIsModalVisible(false);
  };

  searchText = (text) => {
    const newData = this.props.optionData.filter((item) => {
      const itemData = `${item.name.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({searchableList: newData, searchbarText: text});
  };

  render() {
    const {
      label = '',
      value,
      style,
      isError = false,
      optionModalStyle,
      optionData,
      onOptionChoose,
      useIndexReturn = false,
      hasHelper = true,
      isLoading = false,
      isSearchable = false,
    } = this.props;

    const hasIcon = optionData
      ? optionData[0]
        ? optionData[0].mcIcon || optionData[0].mIcon
        : false
      : false;

    return (
      <View>
        <TouchableOpacity
          style={{
            ...styles.pressContainer,
            ...style,
          }}
          onPress={this.toggleModal}>
          <Text style={value ? styles.labelActive : styles.labelInactive}>
            {label}
          </Text>
          <Text style={{marginHorizontal: 10}}>:</Text>
          <Text style={value ? styles.nilaiActive : styles.nilai}>
            {value ? `${value}` : '.....'}
          </Text>

          {isLoading ? (
            <ActivityIndicator size="small" style={styles.icon} />
          ) : (
            <MCIcons
              name="menu-down"
              size={25}
              color={DefaultTheme.colors.text}
              style={styles.icon}
            />
          )}
        </TouchableOpacity>
        {hasHelper && (
          <HelperText
            style={styles.helper}
            type={!isError ? 'info' : 'error'}
            visible={!!isError}>
            {!isError ? 'Sesuai' : '*error'}
          </HelperText>
        )}

        {/* <Portal> */}
        <Modal
          // isVisible={true}
          isVisible={this.state.isModalVisible}
          backdropOpacity={0.5}
          onBackButtonPress={this.toggleModal}
          onBackdropPress={this.toggleModal}
          animationIn="fadeIn"
          animationOut="fadeOut"
          useNativeDriver={true}>
          <View
            style={[
              {
                ...styles.optionModalCard,
                ...optionModalStyle,
              },
              isSearchable && styles.optionModalCardSearchable,
            ]}>
            {/* <Text>INI LAYAR HM</Text> */}
            {isLoading ? (
              <ActivityIndicator size="large" style={{margin: 100}} />
            ) : (
              <>
                {isSearchable && (
                  <Searchbar
                    style={{
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    placeholder={`Search ${label}`}
                    onChangeText={(text) => this.searchText(text)}
                    value={this.state.searchbarText}
                  />
                )}
                {isSearchable &&
                (!this.state.searchableList
                  ? false
                  : !this.state.searchableList.length) ? (
                  <NoData />
                ) : (
                  <FlatList
                    data={
                      (isSearchable
                        ? this.state.searchableList
                        : optionData) || [
                        {
                          name: 'No Option',
                          description: 'Option choices empty',
                        },
                      ]
                    }
                    renderItem={({item, index}) => (
                      <List.Item
                        title={item.name}
                        description={item.description}
                        onPress={() =>
                          this.handleOptionChoose(
                            useIndexReturn
                              ? isSearchable
                                ? item.id
                                : index
                              : item.value || item.name,
                          )
                        }
                        left={(props) =>
                          hasIcon ? (
                            <List.Icon
                              {...props}
                              style={{...props.style, marginRight: 5}}
                              icon={({size, color}) =>
                                item.mIcon ? (
                                  <MIcons
                                    name={item.mIcon}
                                    size={size}
                                    color={Colors.red500}
                                  />
                                ) : (
                                  <MCIcons
                                    name={item.mcIcon}
                                    size={size}
                                    color={Colors.red500}
                                  />
                                )
                              }
                            />
                          ) : null
                        }
                        // right={props => <List.Icon {...props} icon="chevron-right" />}
                      />
                    )}
                    ListHeaderComponent={
                      hasIcon && <View style={{height: 5}} />
                    }
                    ListFooterComponent={
                      hasIcon && <View style={{height: 5}} />
                    }
                    ItemSeparatorComponent={!hasIcon && Divider}
                    keyExtractor={(item, id) => id.toString()}
                  />
                )}
              </>
            )}
          </View>
        </Modal>
        {/* </Portal> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pressContainer: {
    borderWidth: 1,
    // borderColor: 'transparent',
    borderColor: DefaultTheme.colors.text,
    borderRadius: 25,
    marginTop: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
    paddingLeft: 25,
  },
  labelInactive: {
    color: DefaultTheme.colors.placeholder,
    fontSize: 16,
    marginHorizontal: 5,
    width: 121,
  },
  labelActive: {
    color: Colors.grey800,
    fontSize: 10,
    marginHorizontal: 5,
    width: 53,
  },
  nilai: {
    color: DefaultTheme.colors.placeholder,
    fontSize: 16,
    marginHorizontal: 5,
    width: 162,
  },
  nilaiActive: {
    color: DefaultTheme.colors.placeholder,
    fontSize: 16,
    marginHorizontal: 5,
    width: 180,
    fontWeight: 'bold',
  },
  icon: {marginRight: 6.5},
  helper: {
    marginTop: -5,
    marginBottom: -5,
    textAlign: 'right',
  },
  optionModalCard: {
    borderRadius: 10,
    backgroundColor: Colors.white,
    elevation: 5,
  },
  optionModalCardSearchable: {
    flex: 1,
  },
});

export default InputOption;
