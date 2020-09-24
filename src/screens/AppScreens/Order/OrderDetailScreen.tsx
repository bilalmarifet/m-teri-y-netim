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
import {Thumbnail, Icon, Item, Label, Input, Spinner} from 'native-base';
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

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  loading: boolean;
  orders: IOrderItem[];
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

  renderContent() {
   
        return(
            <View>
                <View style={{}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,backgroundColor:'white',borderBottomColor:colors.borderColor,borderBottomWidth:1}}>
                    <View style={{flexDirection:'row'}}>
                        <Icon style={{fontSize:24}} type="MaterialCommunityIcons" name="calendar-today" />
        <Text style={{fontFamily:fonts.primaryFont,marginLeft:10,marginTop:2}}>{this.state.order.dateTime}</Text>
                    </View>
                    <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16}}>ID #123123</Text>
                       
                    </View>
                    <View style={{padding:20,borderBottomColor:colors.borderColor,borderBottomWidth:1}}>
                        <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16,marginBottom:15}}>Sipariş Durumu</Text>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}> 
                        <Icon type="AntDesign" name="close" style={{fontSize:12,color:colors.accent,marginTop:2}} />
                        <Text style={{marginLeft:10}}>Siparişiniz hazırlanıyor.</Text></View>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}> 
                        <Icon type="AntDesign" name="close" style={{fontSize:12,color:colors.accent,marginTop:2}} />
                        <Text style={{marginLeft:10}}>Siparişiniz yolda.</Text></View>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}> 
                        <Icon type="AntDesign" name="check" style={{fontSize:12,color:colors.IconColor,marginTop:2}} />
                        <Text style={{marginLeft:10}}>Siparişiniz tamamlandı.</Text></View>
                    </View>
                    <View style={{padding:20,backgroundColor:'white',borderBottomColor:colors.borderColor,borderBottomWidth:1}}>
                    <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16}}>Adres</Text>
                    <Text style={{fontFamily:fonts.primaryFont,marginTop:10}}>Cin cin mahallesi 231. sk. no:26 Pendik/Istanbul</Text>
                    </View>
                    <View style={{padding:20,borderBottomColor:colors.borderColor,borderBottomWidth:1}}>
                    <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16}}>Sipariş Detayı</Text>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                    <Text style={{fontFamily:fonts.primaryFont}}>19 lt damacana</Text>
                    <Text style={{fontFamily:fonts.primaryFont}}>1 x 3.5      3.5 TL</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                    <Text style={{fontFamily:fonts.primaryFont}}>6'li su</Text>
                    <Text style={{fontFamily:fonts.primaryFont}}>5 x 15       75 TL</Text>
                    </View>
                    
                    </View>
                    <View style={{padding:20,backgroundColor:'white',borderBottomColor:colors.borderColor,borderBottomWidth:1}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600",fontSize:16}}>Toplam</Text>
                    <Text style={{fontFamily:fonts.primaryFont,fontWeight:"900",fontSize:16}}>150 TL</Text>
                    
                    </View>
                    <Text style={{fontFamily:fonts.primaryFont,color:colors.textColor,marginTop:10}}>Sipariş detayınzı bu sayfadan kontrol edebilirsiniz.</Text>
                    <Text style={{fontFamily:fonts.primaryFont,color:colors.textColor,marginTop:5}}>Siparişiniz için teşekkür ederiz.</Text>
                
                    </View>
                </View>
            </View>
        )
         
      
    
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
});

function bindToAction(dispatch: any) {
  return {
  
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(OrderDetailScreen);
