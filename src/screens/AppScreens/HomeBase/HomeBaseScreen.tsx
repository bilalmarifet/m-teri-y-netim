import React, { Component } from "react";
import { View, StyleSheet, ImageBackground, FlatList, Text, Linking,Share, Platform,TouchableHighlight } from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { colors, fonts } from "../../../constants";
import { ListItem } from "../../../components/ListItem";
import { connect } from "react-redux";
import { AppState } from "../../../redux/store";
import { } from "react-native";
import { Dimensions } from "react-native";
import { Image } from "react-native";
import { Item } from "native-base";
import {  TouchableWithoutFeedback } from "react-native-gesture-handler";
import { getStoreInformationFromStoreId, storeInformation } from "../../../redux/actions/profileActions";
import Rate, { AndroidMarket } from 'react-native-rate'

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  loading: boolean;
  getStoreInformationFromStoreId: () => void;
  storeInformation: storeInformation
}
const options = {
  AppleAppID: "1534199631",
  GooglePackageName: "com.ozanSu",
  AmazonPackageName: "com.mywebsite.myapp",
  OtherAndroidURL: "http://www.randomappstore.com/app/47172391",
  preferredAndroidMarket: AndroidMarket.Google,
  preferInApp: false,
  openAppStoreIfInAppFails: true,
  fallbackPlatformURL: "http://www.mywebsite.com/myapp.html",
}

const applink = Platform.OS === "ios" ? 'https://apps.apple.com/tr/app/ozansu/id1534199631?l=tr' : 'https://play.google.com/store/apps/details?id=com.ozanSu'
const DATA = [
  {
    id: 0,
    title: "Yazarak",
    source: require('../../../assets/base/004-whatsapp.png')
  },
  {
    id: 1,
    title: "Sipariş ver",
    source: require('../../../assets/base/003-order.png')
  },
  {
    id: 2,
    title: "Arayarak",
    source: require('../../../assets/base/005-phone-call.png')
  },
  {
    id: 3,
    title: "Bildirimler",
    source: require('../../../assets/base/006-chat.png')
  },
  {
    id: 4,
    title: "Puan verin",
    source: require('../../../assets/base/007-star.png')
  },
  {
    id: 5,
    title: "Önerin",
    source: require('../../../assets/base/009-good.png')
  },
];

const ITEMWIDTH = Dimensions.get('screen').width / 3 - 30
const ImageHeightGeneral = Dimensions.get('screen').height
class HomeBaseScreen extends Component<Props, {}> {

  componentDidMount() {
    this.props.getStoreInformationFromStoreId()
  }
  static navigationOptions = ({ }) => {
    header: null
  };

  renderItem = ({ item }) => {

    return (
      <View style={{
        margin: 15, backgroundColor: 'white', shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 1, borderRadius: 5
      }}>
        <TouchableHighlight disabled={item.id === 2 && (!this.props.storeInformation || (this.props.storeInformation && !this.props.storeInformation.phoneNumber))} underlayColor="#AAA" onPress={() => this.routeUser(item.id)} style={{
          width: ITEMWIDTH, height: ITEMWIDTH, backgroundColor: 'white', borderRadius: 5,
        }}>
          <View>
            <Image source={item.source} style={{ width: ITEMWIDTH - 50, height: ITEMWIDTH - 50, alignSelf: 'center', marginTop: 10 }} />
            <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: fonts.h3Font, color: colors.textColorLighter }}>{item.title}</Text>
          </View>
        </TouchableHighlight>
      </View>

    );
  };

  async routeUser(id: Number) {
    if (id === 0) {
      Linking.openURL(`whatsapp://send?text=${"Merhaba ozansu sipariş vermek istiyorum"}&phone=xxxxxxxxxxxxx`)
    }
    else if (id === 1) {
      this.props.navigation.navigate('AppStack')
    }
    else if (id === 2) {
      let phone = this.props.storeInformation ? this.props.storeInformation.phoneNumber ? this.props.storeInformation.phoneNumber.length === 10 ? "0" + this.props.storeInformation.phoneNumber : this.props.storeInformation.phoneNumber : null : null
      if (phone) {
        Linking.openURL(`tel:${phone}`)

      }
    }
    else if (id == 4) {
      Rate.rate(options, success => {
        if (success) {
          // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
          this.setState({ rated: true })
        }
      })
    }else if(id === 5) {

        try {
          const result = await Share.share({
           title: 'Uygulamayı indir',
      message: `Ozansu uygulamasını indirebilirsin, Uygulama linki: ${applink}`, 
      url: `${applink}`
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
        }
    }
  }
  render() {
    const { navigation } = this.props;
    return (


      <ImageBackground
        source={require('../../../assets/waterBg-2.jpg')}
        style={{ flex: 1, opacity: 1 }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba( 0, 0, 0,0.01 )' }}>


          <View style={{
            backgroundColor: 'white', height: 200, width: 200, marginTop: ImageHeightGeneral / 7, justifyContent: 'center', alignSelf: 'center', borderRadius: 100, shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 1
          }}>
            <Image style={{ alignSelf: 'center' }} source={require('../../../assets/BaseImage.png')} />
          </View>
          <FlatList
            bounces={false}
            contentContainerStyle={{ position: 'absolute', bottom: 30 }}
            data={DATA}
            renderItem={this.renderItem}
            numColumns={3}
          />
        </View>
      </ImageBackground>

    );
  }
}


const mapStateToProps = (state: AppState) => ({
  loading: state.profile.loading,
  storeInformation: state.profile.storeInformation
});

function bindToAction(dispatch: any) {
  return {
    getStoreInformationFromStoreId: () =>
      dispatch(getStoreInformationFromStoreId())
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(HomeBaseScreen);
