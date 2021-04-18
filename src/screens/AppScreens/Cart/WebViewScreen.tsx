import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, Button, Text, Image, TouchableOpacity,TouchableHighlight } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import { connect } from 'react-redux';
import { Header } from '../../../components';
import styles from '../styles';
import { AvatarItem } from '../../../components';
import { logoutUserService } from '../../../redux/services/user';
import { Thumbnail, Card, Spinner, ListItem, Left, Radio, Right } from 'native-base';
import { fetchImageData, fetchMoreImageData } from '../../../redux/actions/fetch';
import { ScrollView } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import { colors, fonts } from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';
import {
  IncOrDecItemFromCart,
  IProductItemCustomer,
} from '../../../redux/actionsCustomer/ProductAction';
import { InfoItem } from '../../../components/InfoItem';
import { product } from '../../AppScreens/Customer/orderAdd';
import { getPaymentMethod, PaymentMethod } from '../../../redux/actions/addOrderAction';
import { AppState } from '../../../redux/store';
import { UserInfo } from '../../../redux/actions/profileActions';
import { getCustomerOrderDetail, getCustomerOrderForCheckingPaymentWithCreditCard, isLoadingOrderList } from '../../../redux/actions/orderDetailActions';
import { showSimpleMessage } from '../../../components/showMessage';
import Icon from 'react-native-vector-icons/Feather';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons'
import FastImage from 'react-native-fast-image';
import { WebView } from 'react-native-webview';
import { Dimensions } from 'react-native';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  getCustomerOrderDetail: (orderId : number) => void;
  getCustomerOrderForCheckingPaymentWithCreditCard: (orderId : number) => void;
}


interface State {
  webUri: String;
  notificationResponse: any;
  orderId: number;
  isLoading:boolean;
  customerName:String;
}

class WebViewScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      webUri: this.props.navigation.getParam('webUri'),
      notificationResponse: this.props.navigation.getParam('notificationResponse'),
      orderId: Number(this.props.navigation.getParam('orderId')) ?? 0,
      isLoading: true,
      customerName: this.props.navigation.getParam('customerName')
    };
  }

  
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Ödeme Ekranı',
      headerStyle: {
        backgroundColor: colors.headerColorTop,

        header:
        {
          shadowColor: 'transparent',
          shadowRadius: 0,
          shadowOffset: {
              height: 0,
          },
       
        },
        elevation: 0,
        borderBottomWidth:0.5,
        borderBottomColor:'#ccc'
      },
      headerLeft: null,
      headerRight: <TouchableOpacity onPress= {()=> {
        navigation.getParam('callingFun')();
      }}><Icon name="x"  style={{fontSize:25,color:'white',marginRight:10}} /></TouchableOpacity>
    };
  };

  callingFun = () => {
    // let orderId = 12312
    // this.props.getCustomerOrderDetail(orderId)
    this.props.getCustomerOrderForCheckingPaymentWithCreditCard(this.state.orderId)
    this.props.navigation.goBack()
}
componentDidMount() {
  const { navigation } = this.props
  navigation.setParams({
      callingFun: this.callingFun,
  })
}

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading && <Spinner style={{position:'absolute',top:"44%",left:'47%',zIndex:10}} size="large" color={colors.IconColor} />}
        <WebView
        onLoadEnd={()=>this.setState({isLoading:false})}
        source={{ uri: this.state.webUri }} />
      </View>
    );
  }

  
  
}

const mapStateToProps = (state: AppState) => ({

  
});

function bindToAction(dispatch: any) {
  return {
    getCustomerOrderDetail: (orderId : number) => 
    dispatch(getCustomerOrderDetail(orderId)),
    getCustomerOrderForCheckingPaymentWithCreditCard: (orderId : number) => 
    dispatch(getCustomerOrderForCheckingPaymentWithCreditCard(orderId))
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(WebViewScreen);
