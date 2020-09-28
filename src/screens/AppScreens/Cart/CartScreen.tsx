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
import { isLoadingOrderList } from '../../../redux/actions/orderDetailActions';
import { showSimpleMessage } from '../../../components/showMessage';
import Icon from 'react-native-vector-icons/Feather';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons'
interface Props {
  navigation: NavigationScreenProp<NavigationState>;

  productList: IProductItemCustomer[];
  IncOrDecItemFromCart: (
    productsList: IProductItemCustomer[],
    productId: number,
    isIncrease: boolean,
    index?: number,
  ) => void;
  
  loadingIndex: number;
  loadingIncDec: boolean;
  userInfo: UserInfo;
  isLoading: boolean;
}

interface itemProp {
  item: any;
}

interface State {
  page: number;
  limit: number;
  change: boolean;
}

class CartScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
      limit: 20,
      change: false,
    };
  }

  

  showSimpleMessage() {
    if (this.props.Message) {
      showMessage({
        message: this.props.Message,
        type: this.props.isSuccess ? 'success' : 'danger',
        icon: 'auto',
      });
    }
  }



  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Sepet',

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
  renderPlusButton(item: IProductItemCustomer, index: number) {
    if (item.count > 0) {
      return (
        <View style={{ backgroundColor: '#F1F1F1', position: 'absolute', paddingLeft: 5, paddingRight: 5, paddingVertical: 5, borderRadius: 15, right: 10, bottom: 15 }}>
          {this.props.loadingIncDec &&
            this.props.loadingIndex === item.productId && (
              <Spinner
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  backgroundColor: colors.borderColor,
                  opacity: 0.8,
                  width: '100%',
                  height: '100%',
                }}
                color={colors.headerColor}
              />
            )}

          <View style={{
            flexDirection: 'row', shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,

            elevation: 7,
          }}>
            <TouchableOpacity
              style={styles.IncOrDecButton}
              onPress={() => {
                this.props.IncOrDecItemFromCart(
                  this.props.productList,
                  item.productId,
                  true,
                  index,
                );
              }}>
              <Icon
                name="plus"
                style={{ color: colors.priceAndPlusColor, fontSize: 20 }}
              />
            </TouchableOpacity>
            <Text style={{ alignSelf: 'center', marginRight: 8, marginLeft: 8 }}>
              {item.count}
            </Text>
            <TouchableOpacity
              style={styles.IncOrDecButton}
              onPress={() => {
                this.props.IncOrDecItemFromCart(
                  this.props.productList,
                  item.productId,
                  false,
                  index,
                );
              }}>
              <Icon
                name="minus"

                style={{ color: colors.priceAndPlusColor, fontSize: 20 }}
              />
            </TouchableOpacity>
            
          </View>
        </View>
      );
    } else {
      return (
        //         <TouchableOpacity onPress={()=> {

        // <Icon name="ios-add-circle" style={{color : colors.iconColorSecond}}/>
        //        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.headerColor,
                flex: 1,
                justifyContent: 'center',
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}
              onPress={() => {
                this.props.IncOrDecItemFromCart(
                  this.props.productList,
                  item.productId,
                  false,
                  index,
                );
              }}>
              <Icon
                name="plus"
                style={{ color: 'white' }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  checkLogin(){
    if(global.TOKEN){
      this.props.navigation.navigate('CartCheckout');
    }
    else{
      showSimpleMessage("Sipariş verebilmek için lütfen giriş yapınız", "info");
      this.props.navigation.navigate("Login");
    }
  }
  render() {
    const cart = this.props.productList
      ? this.props.productList.length > 0
        ? this.props.productList.filter(e => e.count > 0)
        : []
      : [];

    var price = 0;
    cart.map(e => (price += e.price * e.count));

    return (
      <View style={styles.container}>

        {this.renderContent(cart, price)}

      </View>
    );
  }
  renderBottom(price: number) {
    if (price > 0) {
      return (
        <TouchableHighlight

          onPress={() => this.checkLogin()}
          underlayColor="#AAA"
          style={{
            borderRadius: 5,
              marginLeft: 20,
              marginRight: 20,
              marginTop: 10,
              }}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={['#30AE4A', '#7BAD7B']}
            style={{
              borderRadius: 5,
              paddingTop: 5,
              paddingHorizontal: 10,
              paddingBottom: 10,
              backgroundColor: colors.buttonBackgroundPrimary,
              flexDirection: 'row',
              
              justifyContent: 'space-between',
            }}>

            <View style={{paddingLeft:10}}>
              <View style={{ flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontWeight: '600',
                    color: '#fff',
                  }}>
                  Toplam Fiyat :
            </Text>
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    color: '#fff',
                  }}>
                  {price} ₺
            </Text>
              </View>
              <View>
              <Text style={{
                fontFamily: 'Roboto',
                color: '#fff',
              }}>Siparişi Tamamla</Text>
              </View>
            </View>
            <View>
                  <Icon name="chevron-right" style={{ color: 'white', marginTop: 10, fontSize: 18 }} type="Feather" />


            </View>


          </LinearGradient>
        </TouchableHighlight>
      );
    }
  }
  
  
  renderContent(cart: IProductItemCustomer[], price: number) {
    console.log("carrrt", cart)
    if (cart.length > 0) {
      return (
        <ScrollView>
          <FlatList
            contentContainerStyle={{ paddingTop: 0 }}
            data={cart}
            keyExtractor={item => item.productId}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.itemCart}>
                  {this.renderPlusButton(item,index)}
                  <View style={{ width: '60%', flexDirection: 'row' }}>
                    <View>
                      <Image style={{ width: 80, height: 80, marginLeft: 10 }} source={{ uri: item.imagePath }} />
                    </View>
                    <View style={{ marginTop: 10, marginLeft: 10 }}>

                      <Text
                        style={{
                          fontFamily: 'roboto',
                          color: colors.textColor,
                          alignSelf: 'center',

                        }}>
                        {item.productName}
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 0.5 }}>
                          <Text>{item.price} TL</Text>
                        </View>





                      </View>

                    </View>

                  </View>
                </View>
              );
            }}
          />


          {this.renderBottom(price)}
        </ScrollView>
      );
    } else {
      return (
        <InfoItem
          style={{ marginTop: 30 }}
          imageResource={require('../../../assets/not-found.png')}
          text={
            'Sepete eklediğiniz ürün bulunmamaktadır.'
          }
        />
      );
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  productList: state.CustomerproductForCustomer.productList,
  loadingIndex: state.CustomerproductForCustomer.loadingIndex,
  loadingIncDec: state.CustomerproductForCustomer.loadingIncDec,
  AddOrderMessage: state.addOrder.AddOrderMessage,
  isSuccess: state.addOrder.isSuccess,
  isTried: state.addOrder.isTried,
  userInfo: state.profile.userInfo,
  
});

function bindToAction(dispatch: any) {
  return {
    IncOrDecItemFromCart: (
      productsList: IProductItemCustomer[],
      productId: number,
      isIncrease: boolean,
      index?: number,
    ) =>
      dispatch(
        IncOrDecItemFromCart(productsList, productId, isIncrease, index),
      ),
   
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(CartScreen);
