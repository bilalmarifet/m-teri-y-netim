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
import { AppState } from "../../redux/store";
import { appKilled } from "../../redux/actions/loginAction";
import { connect } from "react-redux";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  appKilled: () => void;
}

class AuthLoading extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.props.appKilled()
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
         <Image source={BaseImageWithName} style={{height:200,marginRight:10}} resizeMode="contain" />

        <Spinner color={colors.IconColor} />
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
});

function bindToAction(dispatch: any) {
  return {
    appKilled: () =>
      dispatch(appKilled())
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(AuthLoading);

