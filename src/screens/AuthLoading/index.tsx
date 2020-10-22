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
import { connect } from "react-redux";
import { getCategories } from "../../redux/actions/categoryAction";
import { AppState } from "../../redux/store";
import { GetProductsForCustomer, IProductItemCustomer } from "../../redux/actionsCustomer/ProductAction";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  getCategories : ()=>void;
  GetProductsForCustomer: (productsList?: IProductItemCustomer[]) => void;
  productList: IProductItemCustomer[];
  loading:boolean;
}

class AuthLoading extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.props.getCategories()
    this.props.GetProductsForCustomer(this.props.productList);
    setTimeout(() => this._bootstrapAsync(), 2000);  
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
  
    this.props.navigation.navigate('AppStack')
   // navigation.navigate(userToken ? "AppStack" : "AuthStack");
 
  };

  componentDidMount() {



  }
  render() {

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
         <Image source={BaseImageWithName} style={{height:200}} resizeMode="contain" />

        <Spinner color={colors.IconColor} />
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  productList: state.CustomerproductForCustomer.productList,
  loading: state.CustomerproductForCustomer.loading,
});

function bindToAction(dispatch: any) {
  return {
    getCategories : () => 
    dispatch(getCategories()),
    GetProductsForCustomer: (productsList?: IProductItemCustomer[]) =>
    dispatch(GetProductsForCustomer(productsList)),
    
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(AuthLoading);

