import { Spinner } from "native-base";
import { config } from "process";
import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { colors } from "../../constants";
import { BaseImage, BaseImageWithName, BaseStoreOwnerUserId } from "../../services/AppConfig";
import * as Animatable from 'react-native-animatable';
import firebase, { storage } from 'react-native-firebase';
import Axios from 'axios';
import { WATER_ADD_CASH, WATER_CREATE_NOTIFICATION } from "../../redux/constants";
interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}
interface State {
  userId: string | null;
  token: string | null;
  notificationToken: string | null;
  isPermissionRequested: boolean;
}

class AuthLoading extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    setTimeout(  () => this.getUserIdToken(), 2000);
    this.state = {
      userId: null,
      token: null,
      notificationToken: null,
      isPermissionRequested: false,
    };
  }

  async   createNotificationtoken(
    notificationToken: string | null,
  ) {
    if (notificationToken) {
      console.log('Onceden Token Var');
      this.props.navigation.navigate( "AppStack");
    } else {
      console.log('Onceden Token yok');
      this.requestPermissionForNotification();
    }
  }

  async sendTokenToApi(
    notificationToken: string,
  ) {

    let token = global.TOKEN
    let userId = global.USERID
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    Axios.post(
      WATER_CREATE_NOTIFICATION,
      {
        userId: userId,
        appToken: notificationToken,
      },
      {headers: headers},
    ).then(res => {
      if (res.data.result) {
        AsyncStorage.setItem('notificationToken', notificationToken);
      }
    });
    const userType = Number(await AsyncStorage.getItem('UserType'));
    global.USER_TYPE = userType;
    if (userType === 3) {
      this.props.navigation.navigate('CustomerMainStack');
    } else {
      this.props.navigation.navigate('MainStack');
    }
  }




  async requestPermissionForNotification() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken);

        this.sendTokenToApi(fcmToken);
      } else {
        // user doesn't have a device token yet
      }
    } else if (!this.state.isPermissionRequested && !enabled) {
      try {
        if (!this.state.isPermissionRequested) {
          this.setState({
            isPermissionRequested: true,
          });
          await firebase.messaging().requestPermission();
          await this.requestPermissionForNotification();
        } else {
          this.props.navigation.navigate( "AppStack");
        }
      } catch (error) {
        this.props.navigation.navigate( "AppStack");
      }
    }
    this.props.navigation.navigate( "AppStack");
  }


  async getUserIdToken() {
    const notificationToken = await AsyncStorage.getItem('notificationToken');
    this._bootstrapAsync(notificationToken);
  }



  
  _bootstrapAsync = async (notificationToken: string | null) => {
    const { navigation } = this.props;
    const userToken = await AsyncStorage.getItem("userToken");
    global.TOKEN = userToken;
    const storeOwnerUserId = BaseStoreOwnerUserId;
    global.STORE_OWNER_USER_ID = Number(storeOwnerUserId);
    const customerId = await AsyncStorage.getItem('customerId');
    global.CUSTOMER_ID = customerId;
    const userId = await AsyncStorage.getItem('userId');
    global.USERID = userId
    this.createNotificationtoken(notificationToken);
  
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center",backgroundColor:colors.splashScreenBackgroundColor }}>
         <Image source={BaseImageWithName} style={{height:200}} resizeMode="contain" />

        <Spinner color={colors.IconColor} />
      </View>
    );
  }
}

export default AuthLoading;
