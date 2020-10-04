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
import { Thumbnail, Card, Spinner, Radio } from 'native-base';
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
import { AddOrderMultiple, changePaymentMehtod, getPaymentMethod, PaymentMethod } from '../../../redux/actions/addOrderAction';
import { AppState } from '../../../redux/store';
import { UserInfo } from '../../../redux/actions/profileActions';
import { ButtonGradient } from '../../../components/ButtonGradient';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  productList: IProductItemCustomer[];
  AddOrderMultiple: (
    productList: product[],
    isPaid: boolean,
    customerId: number,
    paymentType: number,
    type?: number,
    storeOwnerUserId?: number,
    customerName?: string,
  ) => void;
  userInfo: UserInfo;
  getPaymentMethod: () => void;
  loadingForGetPaymentMethods: boolean;
  paymentMethods: PaymentMethod[];
  changePaymentMehtod : (index: number) => void;
  selectedPaymentMethod: number;
  isLoadingAddOrder : boolean;
}

interface State {
}
class CartScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

  }

  componentDidMount(){
    this.props.getPaymentMethod()
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Sepet Ödeme',

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
    };
  };
 

  render() {

    return (
      <View style={styles.container}>

        {this.renderContent()}

      </View>
    );
  }

  handleCartAction(): void {
    let selectedPaymentMethod =  this.props.paymentMethods ? this.props.paymentMethods.length > 0 ? this.props.selectedPaymentMethod ? this.props.paymentMethods[this.props.selectedPaymentMethod].paymentType : 0 : 0 : 0
    var products: product[] = [];
    this.props.productList.map(element =>  {
      if(element.count > 0) {
        var product: product = {
          index: 0,
          productId: element.productId,
          unitPrice: element.isCampaign ? element.newPrice.toString() : element.price.toString(),
          productCount: element.count.toString(),
          productCode: element.productCode,
          productGotUnitPrice: false,
        };
        products.push(product);
      }
    });
    this.props.AddOrderMultiple(
      products,
      false,
      global.CUSTOMER_ID,
      selectedPaymentMethod,
      1,
      global.STORE_OWNER_USER_ID,
      this.props.userInfo
        ? this.props.userInfo.nameSurname
          ? this.props.userInfo.nameSurname
          : undefined
        : undefined,
    );
  }
  renderPaymentMethod() {
    console.log(global.USERID)
    if(this.props.loadingForGetPaymentMethods) {
      return (
        <View>
          <Spinner />
        </View>
      )
    }
    else if(this.props.paymentMethods && this.props.paymentMethods.length > 0) {
      return(
        <View style={{padding:20}}>
          <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600"}}>Ödeme Yöntemi </Text>

                        
          {this.props.paymentMethods.map((element,index)=> {
            return(
              <TouchableOpacity onPress={()=> this.props.changePaymentMehtod(index)} style={{marginLeft:15,height:50,borderBottomColor:'#BBB',borderBottomWidth:0.5,justifyContent:'center'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>

              <Text style={{fontFamily:fonts.primaryFont}}>{element.paymentTypeName}</Text>

              {index === this.props.selectedPaymentMethod && <Icon  name="check" style={{marginRight:15,fontSize:18,color:colors.IconColor}} />}

          </View>
          </TouchableOpacity>
            )
          })}
         
        </View>
      )
    }else {
      return (<View/>)
    }
  }

  renderContent() {
   return(
     <View style={{flex:1}}>
      <View style={{borderColor:colors.IconColor,borderWidth:2,borderRadius:5,margin:20,backgroundColor:'white',paddingTop:20,paddingBottom:40,paddingHorizontal:10}}>


     
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600"}}>Ev Adresi</Text>

        <View style={{backgroundColor:colors.viewBackground,padding:5,borderRadius:5,marginTop:-5}}>
          <Text style={{color:colors.viewBackgroundText}}>Seçili Adres</Text>

        </View>
  
      </View>
      <Text style={{marginTop:20,fontFamily:fonts.primaryFont,color:colors.textColorLighter}}>{this.props.userInfo.address}</Text>
      <TouchableOpacity onPress={()=> this.props.navigation.navigate('CustomerEditProfile')} style={{position:'absolute',right:10,bottom:10}}>
        <Text style={{fontFamily:fonts.primaryFont,fontSize:15}}>Düzenle</Text>
      </TouchableOpacity> 
      </View>
      {this.renderPaymentMethod()}
      
      <ButtonGradient loading={this.props.isLoadingAddOrder || this.props.loadingForGetPaymentMethods} onPress={()=>this.handleCartAction()} linearGredientStyle={{borderRadius:0,height:60}} style={{position:'absolute',bottom:0,left:0,right:0,height:60,borderRadius:0}} text="Alışverişi Tamamla" />
     </View>
   )
  }
}

const mapStateToProps = (state: AppState) => ({
  productList: state.CustomerproductForCustomer.productList,
  userInfo: state.profile.userInfo,
  paymentMethods: state.addOrder.paymentMethods,
  loadingForGetPaymentMethods:state.addOrder.isLoadingGetPaymentMethods,
  selectedPaymentMethod: state.addOrder.selectedPaymentMethodsIndex,
  isLoadingAddOrder: state.addOrder.isLoading,
});

function bindToAction(dispatch: any) {
  return {
    AddOrderMultiple: (
      productList: product[],
      isPaid: boolean,
      customerId: number,
      paymentType: number,
      type?: number,
      storeOwnerUserId?: number,
      customerName?: string,
    ) =>
      dispatch(
        AddOrderMultiple(
          productList,
          isPaid,
          customerId,
          paymentType,
          type,
          storeOwnerUserId,
          customerName,
        ),
      ),
      getPaymentMethod : () => 
      dispatch(getPaymentMethod()),
      changePaymentMehtod : (index: number) => 
      dispatch(changePaymentMehtod(index)),
      
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(CartScreen);
