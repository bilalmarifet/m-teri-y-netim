import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, Button, Text, Image, TouchableOpacity,TouchableHighlight,TextInput } from 'react-native';
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
import { adress, changeSelectedAdressId, getAdress } from '../../../redux/actions/adressAction';
import RBSheet from "react-native-raw-bottom-sheet";
import { Dimensions } from 'react-native';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  productList: IProductItemCustomer[];
  AddOrderMultiple: (
    productList: product[],
    isPaid: boolean,
    customerId: number,
    paymentType: number,
    paymentInfoText: string,
    addressId: number,
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
  getAdress: () => void;
  isLoadingGetAdress: boolean;
  adressList: adress[];
  selectedAdressId: number;
  changeSelectedAdressId: (adressId: number) =>void;
}

interface State {
  paymentInfoText: string;
}
class CartScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paymentInfoText: ""
    }
  }

  componentDidMount(){
    this.props.getPaymentMethod()
    this.props.getAdress()
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
 
  renderChangeAdress() {
    let selectedAdressId = this.props.selectedAdressId !== undefined ? this.props.selectedAdressId : 0
    let selectedAdress = this.props.adressList.find(e=> e.id === selectedAdressId) 
    
    return(
      <View>
        <Text style={{fontFamily:fonts.primaryFont,fontSize:18,textAlign:'center',marginTop:10}}>Adreslerim</Text>
        <TouchableOpacity onPress={()=> this.RBSheet.close()} style={{position:'absolute',right:5,top:10}}>
          <Icon name="x" style={{fontSize:20}} />
        </TouchableOpacity>
       <ScrollView bounces={false}>
       <FlatList
       bounces={false}
          contentContainerStyle={{paddingBottom:10}}
          style={{ }}
          renderItem={({ item, index }) => {
            return (

              <TouchableHighlight onPress={()=> {this.props.changeSelectedAdressId(item.id)
                      this.RBSheet.close()}}
               underlayColor="#E5E5E5"  style={styles.itemAdressChange}>
           <View style={{borderColor:colors.IconColor,borderWidth:2,borderRadius:5,margin:5,backgroundColor:'white',padding:10}}>


     
<View style={{flexDirection:'row',justifyContent:'space-between'}}>
  <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600"}}>{item.title}</Text>

  {selectedAdressId === item.id && <View style={{backgroundColor:colors.viewBackground,padding:5,borderRadius:5,marginTop:-5}}>
    <Text style={{color:colors.viewBackgroundText}}>Seçili Adres</Text>

  </View>}

</View>
<Text style={{marginTop:20,fontFamily:fonts.primaryFont,color:colors.textColorLighter}}>{item.addressInfo}</Text>
</View>
              </TouchableHighlight>
           
           
           );
          }}
          data={this.props.adressList ?? []}
        />
       </ScrollView>


</View>

    )
  }
  render() {

    return (
      <View style={styles.container}>

        {this.renderContent()}
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={Dimensions.get('window').height - 100}
          openDuration={250}
          customStyles={{
            container: {
              borderTopRightRadius:5,
              borderTopLeftRadius:5
            }
          }}
        >
         {this.renderChangeAdress()}
        </RBSheet>
      </View>
    );
  }

  handleCartAction(): void {
    let selectedPaymentMethod =  this.props.paymentMethods ? this.props.paymentMethods.length > 0 ? this.props.selectedPaymentMethod !== undefined ? this.props.paymentMethods[this.props.selectedPaymentMethod].paymentType : 0 : 0 : 0
    var products: product[] = [];
    console.log(selectedPaymentMethod , this.props.paymentMethods , this.props.selectedPaymentMethod, this.props.selectedPaymentMethod !== undefined ? "true" : 'false')
    this.props.productList.map(element =>  {
      if(element.count > 0) {
        var product: product = {
          index: 0,
          productId: element.id,
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
      selectedPaymentMethod,this.state.paymentInfoText,
      this.props.selectedAdressId,
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

  renderPaymentInfoText() {
    return (
      <View style={{borderColor:colors.IconColor,borderWidth:2,borderRadius:5,margin:20,backgroundColor:'white',paddingHorizontal:10,marginTop:0,paddingVertical:10}}>
        <TextInput 
        onChangeText={(paymentInfoText) => this.setState({ paymentInfoText })}
        value={this.state.paymentInfoText}
        maxLength={250}
        style={{minHeight:80,paddingTop: 0,
          paddingBottom: 0,textAlignVertical: 'top'}}
        multiline
        placeholder="Sipariş Notu"
         />
      </View>
    
    )
  }
  renderContent() {

    if(this.props.isLoadingGetAdress) {
      <View style={{flex:1,justifyContent:'center',alignSelf:'center'}}>
          <Spinner color={colors.IconColor} />
      </View>
    }
    let selectedAdressId = this.props.selectedAdressId !== undefined ? this.props.selectedAdressId : 0
    let selectedAdress = this.props.adressList.find(e=> e.id === selectedAdressId) 
    let isAdressCountHigerThanOne = this.props.adressList ? this.props.adressList.length > 1 ? true : false : false
   return(
     <View style={{flex:1}}>
       <ScrollView>

      {(selectedAdress && selectedAdress !== undefined) ? <View style={{borderColor:colors.IconColor,borderWidth:2,borderRadius:5,margin:20,backgroundColor:'white',paddingTop:20,paddingBottom:40,paddingHorizontal:10}}>


     
<View style={{flexDirection:'row',justifyContent:'space-between'}}>
  <Text style={{fontFamily:fonts.primaryFont,fontWeight:"600"}}>{selectedAdress.title}</Text>

  <View style={{backgroundColor:colors.viewBackground,padding:5,borderRadius:5,marginTop:-5}}>
    <Text style={{color:colors.viewBackgroundText}}>Seçili Adres</Text>

  </View>

</View>
<Text style={{marginTop:20,fontFamily:fonts.primaryFont,color:colors.textColorLighter}}>{selectedAdress.addressInfo}</Text>
{isAdressCountHigerThanOne ? <TouchableOpacity onPress={()=> this.RBSheet.open()} style={{position:'absolute',right:10,bottom:10}}>
  <Text style={{fontFamily:fonts.primaryFont,fontSize:15}}>Değiştir</Text>
</TouchableOpacity> : null}
</View>
: null}
      
      {this.renderPaymentInfoText()}
    
      {this.renderPaymentMethod()}
      </ScrollView>
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
  isLoadingGetAdress: state.adress.loading,
  adressList : state.adress.adress,
  selectedAdressId : state.adress.selectedAdressId
});

function bindToAction(dispatch: any) {
  return {
    AddOrderMultiple: (
      productList: product[],
      isPaid: boolean,
      customerId: number,
      paymentType: number,
      paymentInfoText: string,
      addressId: number,
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
          paymentInfoText,
          addressId,
          type,
          storeOwnerUserId,
          customerName,
        ),
      ),
      getPaymentMethod : () => 
      dispatch(getPaymentMethod()),
      changePaymentMehtod : (index: number) => 
      dispatch(changePaymentMehtod(index)),
      getAdress : () => 
      dispatch(getAdress()),
      changeSelectedAdressId: (adressId: number) => 
      dispatch(changeSelectedAdressId(adressId))
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(CartScreen);
