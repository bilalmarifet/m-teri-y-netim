import { Spinner } from "native-base";
import { config } from "process";
import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  Image,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { colors } from "../../constants";
import { BaseImage, BaseImageWithName, BaseStoreOwnerUserId } from "../../services/AppConfig";
import * as Animatable from 'react-native-animatable';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

class AuthLoading extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    setTimeout(  () => this._bootstrapAsync(), 2000);
     
  }
  
  _bootstrapAsync = async () => {
    const { navigation } = this.props;
    const userToken = await AsyncStorage.getItem("userToken");
    global.TOKEN = userToken;
    const storeOwnerUserId = BaseStoreOwnerUserId;
    global.STORE_OWNER_USER_ID = Number(storeOwnerUserId);
    const customerId = await AsyncStorage.getItem('customerId');
    global.CUSTOMER_ID = customerId;
    const userId = await AsyncStorage.getItem('userId');
    global.USERID = userId
  
   // navigation.navigate(userToken ? "AppStack" : "AuthStack");
  navigation.navigate( "AppStack");
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
         <Image source={BaseImageWithName} width={200}  />
        <Spinner color={colors.IconColor} />
      </View>
    );
  }
}

export default AuthLoading;
