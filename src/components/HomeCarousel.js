import React, {Component} from 'react';
import {View, SafeAreaView, Image, Dimensions, Text} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {Colors} from 'react-native-paper';
import axios from 'axios';
import {LoadingIndicator} from '.';
import {ActivityIndicator} from 'react-native';

const {width, height} = Dimensions.get('screen');
// const h_margin = 15;

export class HomeCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // carouselItems: [
      //   {
      //     image: {uri: 'http://storage.ppa-mhu.net/images/1.jpg'},
      //   },
      //   {
      //     image: {uri: 'http://storage.ppa-mhu.net/images/1.jpg'},
      //   },
      //   {
      //     image: {uri: 'http://storage.ppa-mhu.net/images/2.jpg'},
      //   },
      //   {
      //     image: {uri: 'http://storage.ppa-mhu.net/images/3.jpg'},
      //   },
      //   {
      //     image: {uri: 'http://storage.ppa-mhu.net/images/4.jpg'},
      //   },
      //   {
      //     image: {uri: 'http://storage.ppa-mhu.net/images/5.jpg'},
      //   },
      //   {
      //     image: {uri: 'http://storage.ppa-mhu.net/images/6.jpg'},
      //   },
      //   {
      //     image: {uri: 'http://storage.ppa-mhu.net/images/7.jpg'},
      //   },
      //   {
      //     image: {uri: 'http://storage.ppa-mhu.net/images/8.jpg'},
      //   },
      //   {
      //     image: {uri: 'http://storage.ppa-mhu.net/images/9.jpg'},
      //   },
      //   {
      //     image: {uri: 'http://storage.ppa-mhu.net/images/10.jpg'},
      //   },
      // ],
      activeIndex: 0,
      carouselItems: [],
      LoadingIndicator: true,
      requestError: false,
    };
  }

  componentDidMount() {
    this.getCarouselData();
  }

  getCarouselData = () => {
    this.setState({loading: true});
    axios
      .get('/jumbotron')
      .then((res) => {
        // console.warn(JSON.stringify(res.data));
        this.setState({
          loading: false,
          requestError: false,
          carouselItems: res.data.file,
        });
        // alert(JSON.stringify(res.data.file));
      })
      .catch((error) => {
        this.setState({
          loading: false,
          requestError: true,
        });
        alert('Terjadi kesalahan crousel: ' + error);
      });
  };

  _renderItem({item, index}) {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    return (
      <View
        style={{
          borderRadius: 2,
          // height: width / 1.7,
          // width: width,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}>
        <Image
          // source={item.image}
          source={{uri: item.image_file}}
          style={{
            alignSelf: 'center',
            resizeMode: 'contain',
            borderRadius: 5,
            width: width - 20,
            height: width / 1.7,
          }}
        />
      </View>
    );
  }

  render() {
    // const screenWidth = Dimensions.get('window').width;
    return (
      <SafeAreaView
        style={{
          paddingTop: 0,
          paddingBottom: 0,
        }}>
        {/* <View
          style={{
            flexDirection: 'row',
            // marginVertical: 10,
          }}>
          <Carousel
            layout={'default'}
            ref={(ref) => (this.carousel = ref)}
            data={this.state.carouselItems}
            sliderWidth={width}
            itemWidth={width}
            renderItem={this._renderItem}
            onSnapToItem={(index) => this.setState({activeIndex: index})}
            autoplay
          />
        </View> */}
        {this.state.loading ? (
          <View style={{margin: 10}}>
            <ActivityIndicator animating size={30} color={Colors.red500} />
            <View style={{marginBottom: 7}} />
            <Text style={{textAlign: 'center'}}>loading</Text>
          </View>
        ) : this.state.requestError ? (
          <Text style={{margin: 10, textAlign: 'center'}}>carousel error</Text>
        ) : this.state.carouselItems.length <= 0 ? (
          <Text style={{margin: 10, textAlign: 'center'}}>carousel kosong</Text>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 10,
            }}>
            <Carousel
              layout={'default'}
              ref={(ref) => (this.carousel = ref)}
              data={this.state.carouselItems}
              sliderWidth={width}
              itemWidth={width}
              renderItem={this._renderItem}
              onSnapToItem={(index) => this.setState({activeIndex: index})}
              autoplay
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default HomeCarousel;
