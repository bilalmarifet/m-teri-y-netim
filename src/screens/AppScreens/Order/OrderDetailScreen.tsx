import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  Alert,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import {connect} from 'react-redux';
import {Header} from '../../../components';
import styles from '../styles';
import {AvatarItem} from '../../../components';
import {logoutUserService} from '../../../redux/services/user';
import {Thumbnail, Item, Label, Input, Spinner} from 'native-base';
import {fetchImageData, fetchMoreImageData} from '../../../redux/actions/fetch';

import FlashMessage, {showMessage} from 'react-native-flash-message';
import {colors, fonts} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';

import * as Yup from 'yup'; // for everything

import {Formik} from 'formik';
import {GetOrders, GetOrdersMore} from '../../../redux/actions/orderAction';
import {IOrderItem} from '../../../redux/models/orderModel';
import moment from 'moment';
import {AppState} from '../../../redux/store';
import { InfoItem } from '../../../components/InfoItem';
import { ScrollView } from 'react-native-gesture-handler';
import { getCustomerOrderDetail, orderDetail, orderListItem, OrderStatus } from '../../../redux/actions/orderDetailActions';
import { stat } from 'fs';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  loadingForOrderDetail: boolean;
  orders: IOrderItem[];
  getCustomerOrderDetail: (orderId : number) => void;
  orderDetail : orderDetail;

}

interface State {
    order: IOrderItem
}

class OrderDetailScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      order: this.props.orders[0],
    };
  }



  static navigationOptions = ({navigation}) => {
    return {
      title: 'Sipariş Detay',

      headerStyle: {
        backgroundColor: colors.headerColorTop,
        headerTitleStyle: {

          fontFamily: 'Roboto',
          fontSize: 18,
  
        },
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
     
    };
  };
  componentDidMount() {
    this.props.getCustomerOrderDetail(this.props.navigation.getParam('orderId'))
  }

   renderOrderStatus(status: OrderStatus) {
    console.log(status,"status")
    switch (status) {
      case OrderStatus.Waiting:
        console.log("girdii")  
      return (
        <View><Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16,marginBottom:15}}>Sipariş Durumu</Text>
        <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}> 
        <Icon  name="check" style={{fontSize:12,color:colors.IconColor,marginTop:2}} />
        <Text style={{marginLeft:10}}>Siparişiniz hazırlanıyor.</Text></View>
        </View>
        )
      case OrderStatus.null: 
      return (
          <View><Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16,marginBottom:15}}>Sipariş Durumu</Text>
        <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}> 
        <Icon  name="check" style={{fontSize:12,color:colors.IconColor,marginTop:2}} />
        <Text style={{marginLeft:10}}>Siparişiniz hazırlanıyor.</Text></View>
        </View>
      )
      case OrderStatus.OnTheWay:
        return (
          <View><Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16,marginBottom:15}}>Sipariş Durumu</Text>
          <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}> 
          <Icon  name="check" style={{fontSize:12,color:colors.IconColor,marginTop:2}} />
          <Text style={{marginLeft:10}}>Siparişiniz hazırlanıyor.</Text></View>
          <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}> 
          <Icon  name="check" style={{fontSize:12,color:colors.IconColor,marginTop:2}} />
          <Text style={{marginLeft:10}}>Siparişiniz yolda.</Text></View>
          <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}> 
          </View>
          </View>
        )
      case OrderStatus.Exported:
        return (
          <View><Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16,marginBottom:15}}>Sipariş Durumu</Text>
          <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}> 
          <Icon  name="check" style={{fontSize:12,color:colors.IconColor,marginTop:2}} />
          <Text style={{marginLeft:10}}>Siparişiniz hazırlanıyor.</Text></View>
          <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}> 
          <Icon  name="check" style={{fontSize:12,color:colors.IconColor,marginTop:2}} />
          <Text style={{marginLeft:10}}>Siparişiniz yolda.</Text></View>
          <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}> 
          <Icon  name="check" style={{fontSize:12,color:colors.IconColor,marginTop:2}} />
          <Text style={{marginLeft:10}}>Siparişiniz tamamlandı.</Text></View></View>
 
        )
        break;
    
      default:
        break;
    }
  }

  renderContent() {
      if(this.props.loadingForOrderDetail) {
        return(<Spinner color={colors.IconColor} style={{flex:1}} />)
      } 
      if(this.props.orderDetail) {
        let order = this.props.orderDetail
        console.log(order)
        return(
            <ScrollView>
                <View style={{}}>
                    <View style={{padding:20,backgroundColor:'white',borderBottomColor:colors.borderColor,borderBottomWidth:1}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row'}}>
                        <Icon style={{fontSize:24}}  name="clock" />
        <Text style={{fontFamily:fonts.primaryFont,marginLeft:10,marginTop:2}}>{order.createdDate}</Text>
                    </View>
                    
                    <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16}}>ID #{order.orderId}</Text>
                      
                 </View>
                 <View style={{marginTop:10,marginLeft:3}}>
                      <Text style={{fontFamily:fonts.primaryFont, fontWeight:"600"}}>
        Ödeme Türü: <Text style={{fontWeight:'normal'}}>{order.paymentText}</Text>
                      </Text>
                    </View> 
                    </View>
                    <View style={{padding:20,borderBottomColor:colors.borderColor,borderBottomWidth:1}}>
                        {this.renderOrderStatus(order.orderStatus)}
                    </View>
                    <View style={{padding:20,backgroundColor:'white',borderBottomColor:colors.borderColor,borderBottomWidth:1}}>
                    <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16}}>Adres</Text>
                    <Text style={{fontFamily:fonts.primaryFont,marginTop:10}}>{order.customerAddress}</Text>
                    </View>
                    <View style={{padding:20,borderBottomColor:colors.borderColor,borderBottomWidth:1}}>
                    <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16}}>Sipariş Detayı</Text>
                    {order.orderProducts && order.orderProducts.map(element => {
                      return(
                        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                    <Text style={{fontFamily:fonts.primaryFont}}>{element.productName}</Text>
                    <Text style={{fontFamily:fonts.primaryFont}}>{element.count} x {element.unitPrice}      {element.totalPrice}</Text>
                    </View>
                      )
                    })}
                    
                    
                    </View>
                    <View style={{padding:20,backgroundColor:'white',borderBottomColor:colors.borderColor,borderBottomWidth:1}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16}}>Toplam</Text>
                    <Text style={{fontFamily:fonts.primaryFont,fontWeight:"900",fontSize:16}}>{order.displayTotalPrice}</Text>
                    
                    </View>
                    <Text style={{fontFamily:fonts.primaryFont,color:colors.textColor,marginTop:10}}>Sipariş detayınzı bu sayfadan kontrol edebilirsiniz.</Text>
                    <Text style={{fontFamily:fonts.primaryFont,color:colors.textColor,marginTop:5}}>Siparişiniz için teşekkür ederiz.</Text>
                 
                    </View>
                </View>
            </ScrollView>
        )
      }
         
      
    
  }

  render() {
    return (
      <View style={styles.container}>
       <ScrollView bounces={false} contentContainerStyle={{flex:1}}>
       {this.renderContent()}
       </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  orders: state.orders.orders,
  loadingForOrderDetail: state.orderDetail.isLoading,
  orderDetail : state.orderDetail.orderDetail,

});

function bindToAction(dispatch: any) {
  return {
    getCustomerOrderDetail: (orderId : number) => 
    dispatch(getCustomerOrderDetail(orderId))
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(OrderDetailScreen);
