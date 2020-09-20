import React, {Component} from 'react';
import {View, FlatList, ActivityIndicator, Button, Text} from 'react-native';
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
import {Thumbnail, Icon, Card, Spinner} from 'native-base';
import {fetchImageData, fetchMoreImageData} from '../../../redux/actions/fetch';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {showMessage} from 'react-native-flash-message';
import {colors, fonts} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';
import {
  IncOrDecItemFromCart,
  IProductItemCustomer,
} from '../../../redux/actionsCustomer/ProductAction';
import {InfoItem} from '../../../components/InfoItem';
import {product} from '../../AppScreens/Customer/orderAdd';
import {AddOrderMultiple} from '../../../redux/actions/addOrderAction';
import {AppState} from '../../../redux/store';
import {UserInfo} from '../../../redux/actions/profileActions';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;

  productList: IProductItemCustomer[];
  IncOrDecItemFromCart: (
    productsList: IProductItemCustomer[],
    productId: number,
    isIncrease: boolean,
    index?: number,
  ) => void;
  AddOrderMultiple: (
    productList: product[],
    isPaid: boolean,
    customerId: number,
    type?: number,
    storeOwnerUserId?: number,
    customerName?: string,
  ) => void;
  loadingIndex: number;
  loadingIncDec: boolean;
  userInfo: UserInfo;
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

  componentDidMount() {
    // this.props.navigation.setParams({cart: 1});
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

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Sepet',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: colors.headerColor,
        headerTitleStyle: {
          fontWeight: '600',
          fontFamily: 'Avenir Next',
          fontSize: 25,
        },
      },
    };
  };
  renderPlusButton(item: IProductItemCustomer, index: number) {
    if (item.count > 0) {
      return (
        <View style={{flex: 1}}>
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

          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.headerColor,
                flex: 1,
                justifyContent: 'center',
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
                name="minus"
                type="MaterialCommunityIcons"
                style={{color: 'white'}}
              />
            </TouchableOpacity>
            <Text style={{alignSelf: 'center', marginLeft: 10}}>
              {item.count}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.headerColor,
                flex: 1,
                justifyContent: 'center',
                marginLeft: 10,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}
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
                type="MaterialCommunityIcons"
                style={{color: 'white'}}
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

        <View style={{flex: 1}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
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
                type="MaterialCommunityIcons"
                style={{color: 'white'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
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
        {this.renderContent(cart)}
        {this.renderBottom(price)}
      </View>
    );
  }
  renderBottom(price: number) {
    if (price > 0) {
      return (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.containerBgSecond,
            flexDirection: 'row',
            paddingTop: 10,
            paddingHorizontal: 10,
            paddingBottom: 10,
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: fonts.primaryFont,
                fontWeight: '600',
                fontSize: 18,
                alignSelf: 'center',
              }}>
              TOPLAM:
            </Text>
            <Text
              style={{
                fontFamily: fonts.primaryFont,
                alignSelf: 'center',
                marginLeft: 5,
              }}>
              {price} TL
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.handleCartAction()}
            style={{
              flexDirection: 'row',
              backgroundColor: colors.headerColor,
              borderRadius: 5,
              padding: 5,
              justifyContent: 'center',
              minWidth: 140,
            }}>
            <View>
              {this.props.isLoading ? (
                <Spinner size="small" style={{height: 35, width: 35}} />
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="cart" style={{color: 'white'}} />
                  <Text
                    style={{
                      // alignSelf: 'center',
                      textAlign: 'center',
                      marginLeft: 0,
                      color: 'white',
                      width: 100,
                    }}>
                    Alışverişi Tamamla
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }
  handleCartAction(): void {
    var products: product[] = [];
    this.props.productList.map(element => {
      var product: product = {
        index: 0,
        productId: element.productId,
        unitPrice: element.price.toString(),
        productCount: element.count.toString(),
        productCode: element.productCode,
        productGotUnitPrice: false,
      };
      products.push(product);
    });
    this.props.AddOrderMultiple(
      products,
      false,
      global.CUSTOMER_ID,
      1,
      global.STORE_OWNER_USER_ID,
      this.props.userInfo
        ? this.props.userInfo.nameSurname
          ? this.props.userInfo.nameSurname
          : undefined
        : undefined,
    );
  }

  renderContent(cart: IProductItemCustomer[]) {
    if (cart.length > 0) {
      return (
        <ScrollView>
          <FlatList
            contentContainerStyle={{paddingTop: 20}}
            data={cart}
            keyExtractor={item => item.productId}
            renderItem={({item, index}) => {
              return (
                <View style={styles.item}>
                  <View style={{paddingVertical: 10, width: '60%'}}>
                    <Text
                      style={{
                        fontFamily: fonts.primaryFont,
                        color: colors.textColor,
                        fontWeight: 'bold',
                      }}>
                      {item.productName}
                    </Text>
                  </View>

                  <View style={{height: '100%'}}>
                    {this.renderPlusButton(item, index)}
                  </View>
                </View>
              );
            }}
          />
        </ScrollView>
      );
    } else {
      return (
        <InfoItem
          style={{marginTop: 30}}
          imageResource={require('../../../assets/not-found-2.png')}
          text={
            'Sepete eklediğiniz ürün bulunmamaktadır. Sipariş vermek için sepete ürün eklemelisiniz.'
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
  isLoading: state.addOrder.isLoading,
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
    AddOrderMultiple: (
      productList: product[],
      isPaid: boolean,
      customerId: number,
      type?: number,
      storeOwnerUserId?: number,
      customerName?: string,
    ) =>
      dispatch(
        AddOrderMultiple(
          productList,
          isPaid,
          customerId,
          type,
          storeOwnerUserId,
          customerName,
        ),
      ),
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(CartScreen);
