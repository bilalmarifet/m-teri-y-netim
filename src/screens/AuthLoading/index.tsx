import { config } from "process";
import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { BaseStoreOwnerUserId } from "../../services/AppConfig";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

class AuthLoading extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this._bootstrapAsync();
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
        <ActivityIndicator />
      </View>
    );
  }
}

export default AuthLoading;
