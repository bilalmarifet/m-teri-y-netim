import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, Button, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { NavigationScreenProp, NavigationState, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Header } from "../../../components";
import styles from "../styles";
import { AvatarItem } from "../../../components";
import { logoutUserService } from "../../../redux/services/user";
import { Thumbnail, Spinner } from 'native-base'
import {
  fetchImageData,
  fetchMoreImageData
} from "../../../redux/actions/fetch";

import { showMessage } from "react-native-flash-message";
import { colors, fonts } from "../../../constants";
import LinearGradient from 'react-native-linear-gradient';
import { AppState } from "../../../redux/store";
import { IProductItem } from "../../../redux/models/productModel";
import { GetProductsForCustomer, IProductItemCustomer, IncOrDecItemFromCart, ICampaignItem, GetCampaignHome } from "../../../redux/actionsCustomer/ProductAction";
import { TotalPriceText } from "../../../components/TotalPriceText";
import { getUserInfo } from "../../../redux/actions/profileActions";
import Icon from "react-native-vector-icons/Feather";
import { SliderBox } from "react-native-image-slider-box";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  productList: IProductItemCustomer[]
  loading: boolean;
  GetProductsForCustomer: (productsList?: IProductItemCustomer[]) => void;
  IncOrDecItemFromCart: (productsList: IProductItemCustomer[], productId: number, isIncrease: boolean, index?: number) => void;
  GetCampaignHome: () => void;
  loadingIndex: number;
  getUserInfo: () => void;
  loadingIncDec: boolean;
  campaings: ICampaignItem[];
}

interface itemProp {
  item: any;
}

interface State {
  page: number;
  limit: number;
  change: boolean;
  images: string[];
}



const MyTitle = ({ navigation, productList }) => <TotalPriceText productList={productList} navigation={navigation} />;
const MyConnectedTitle = connect((storeState: AppState) => ({ productList: storeState.CustomerproductForCustomer.productList }))(MyTitle);





class CustomerHomeScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
      limit: 20,
      change: false,
      images: [
        require('../../../images/damacana-kampanya.png'),
        "https://source.unsplash.com/1024x768/?nature",
        "https://source.unsplash.com/1024x768/?water",
        "https://source.unsplash.com/1024x768/?girl",
        "https://source.unsplash.com/1024x768/?tree", // Network image

      ]
    };

  }

  componentDidMount() {
    this.props.GetProductsForCustomer(this.props.productList);
    this.props.GetCampaignHome();

    var TotalPrice = 0;
    this.props.productList ? this.props.productList.map(e => TotalPrice += e.price * e.count) : null
    this.props.navigation.setParams({ cart: TotalPrice })
    this.props.getUserInfo();
  }

  // componentDidUpdate(prevProps : Props, prevState : State) {

  // var totalPrice = 0;
  // this.props.productList ? this.props.productList.length > 0 ? this.props.productList.map(e=> totalPrice += e.count * e.price) : null : null;

  //     // this.props.navigation.setParams({cart : totalPrice})

  // }

  handleLogout = () => {
    const { navigation } = this.props;
    logoutUserService().then(() => {
      navigation.navigate("AuthStack");
    });
  };

  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Anasayfa',

      headerStyle: {
        backgroundColor: colors.headerColorTop,
        headerTitleStyle: {
          fontFamily: 'Roboto'

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
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc'
      },
      headerRight:
        <MyConnectedTitle navigation={navigation} />
    }
  };
  renderPlusButton(item: IProductItemCustomer, index: number) {

    if (item.count > 0) {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
        <View style={{ backgroundColor: '#F1F1F1', position: 'absolute', paddingLeft: 5, paddingRight: 5, paddingVertical: 5, borderRadius: 15, right: 10, bottom: 10 }}>
          {this.props.loadingIncDec && this.props.loadingIndex === item.productId && <Spinner style={{ position: "absolute", zIndex: 1, backgroundColor: colors.borderColor, opacity: .8, width: '100%', height: '100%' }} color={colors.headerColor} />}

          <View style={{
            flexDirection: 'row', shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,

            elevation: 3,
          }}>
            <TouchableOpacity style={styles.IncOrDecButton} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.productId, true);
              this.props.navigation.setParams({ cart: cart + item.price });
              this.setState({ page: this.state.page + 1 })
            }}><Icon name="plus"
              style={{ color: colors.priceAndPlusColor, fontSize: 20 }} /></TouchableOpacity>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', paddingHorizontal: 5, color: colors.textColor }}>{item.count}</Text>
            <TouchableOpacity style={styles.IncOrDecButton} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.productId, false);
              this.props.navigation.setParams({ cart: cart - item.price });
              this.setState({ change: !this.state.change })
            }}><Icon name="minus"
              style={{ color: colors.priceAndPlusColor, fontSize: 20 }} /></TouchableOpacity>



          </View>
        </View>
      )
    }
    else {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
        <View style={{ backgroundColor: '#F1F1F1', position: 'absolute', paddingLeft: 5, paddingRight: 5, paddingVertical: 5, borderRadius: 15, right: 10, bottom: 10 }}>
          {this.props.loadingIncDec && this.props.loadingIndex === item.productId && <Spinner style={{ position: "absolute", zIndex: 1, backgroundColor: colors.borderColor, opacity: .8, width: '100%', height: '100%' }} color={colors.headerColor} />}

          <View style={{
            flexDirection: 'row', shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,

            elevation: 3,
          }}>
            {this.props.loadingIncDec && this.props.loadingIndex === item.productId && <Spinner style={{ zIndex: 1, backgroundColor: colors.borderColor, opacity: .8 }} size="small" color={colors.headerColor} />}
            <TouchableOpacity style={styles.IncOrDecButton} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.productId, true)
              this.props.navigation.setParams({ cart: cart + item.price });
              this.setState({ change: !this.state.change })
            }}>

              <Icon name="plus"
                style={{ color: colors.priceAndPlusColor, fontSize: 20 }} /></TouchableOpacity>
          </View>
        </View>
      )
    }
  }


  renderPlusButtonCampaign(item: IProductItemCustomer, index: number) {

    if (item.count > 0) {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
        <View style={{ position: 'absolute', top: 0, right: 0, zIndex: 10, paddingVertical: 5, paddingLeft: 5, paddingRight: 5 }}>
          {this.props.loadingIncDec && this.props.loadingIndex === item.productId && <Spinner style={{ position: "absolute", backgroundColor: colors.borderColor, opacity: .8, width: '100%', height: '100%' }} color={colors.headerColor} />}

          <View >
            <TouchableOpacity style={styles.IncOrDecButton} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.productId, true);
              this.props.navigation.setParams({ cart: cart + item.price });
              this.setState({ page: this.state.page + 1 })
            }}><Icon name="plus"
              style={{ color: colors.priceAndPlusColor, fontSize: 20 }} /></TouchableOpacity>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', paddingHorizontal: 5, color: colors.textColor }}>{item.count}</Text>
            <TouchableOpacity style={styles.IncOrDecButton} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.productId, false);
              this.props.navigation.setParams({ cart: cart - item.price });
              this.setState({ change: !this.state.change })
            }}><Icon name="minus"
              style={{ color: colors.priceAndPlusColor, fontSize: 20 }} /></TouchableOpacity>



          </View>
        </View>
      )
    }
    else {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
        <View style={{ position: 'absolute', top: 0, zIndex: 10, paddingVertical: 5, paddingLeft: 5, paddingRight: 5, right: 0 }}>
          {this.props.loadingIncDec && this.props.loadingIndex === item.productId && <Spinner style={{ position: "absolute", zIndex: 1, backgroundColor: colors.borderColor, opacity: .8, width: '100%', height: '100%' }} color={colors.headerColor} />}

          <View style={{ zIndex: 100 }} >
            {this.props.loadingIncDec && this.props.loadingIndex === item.productId && <Spinner style={{ zIndex: 1, backgroundColor: colors.borderColor, opacity: .8 }} size="small" color={colors.headerColor} />}
            <TouchableOpacity style={styles.IncOrDecButton} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.productId, true)
              this.props.navigation.setParams({ cart: cart + item.price });
              this.setState({ change: !this.state.change })
            }}>


              <Icon name="plus"
                style={{ color: colors.priceAndPlusColor, fontSize: 20 }} /></TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  renderProductItem(item: IProductItemCustomer, index: number) {
    return (
      <View style={{ marginBottom: 10 }}>
        <View style={styles.itemCampaign}>
          <View style={{ paddingVertical: 10, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
            <Image
              style={{ width: Dimensions.get('window').width / 4.5, height: Dimensions.get('window').width / 5 }}
              source={{ uri: item.imagePath }}
            />
          </View>


          {this.renderPlusButtonCampaign(item, index)}

          <Text style={{ fontFamily: 'roboto', color: colors.textColor, width: '90%' }}>
            {item.productName}
          </Text>
          <Text style={{ fontFamily: fonts.primaryFont, marginTop: 5, color: colors.priceAndPlusColor, fontWeight: 'bold' }}>
            {item.price} TL
      </Text>
        </View>

      </View>

    );
  }

  renderCampaignProducts() {

    let count: number = 0;
    this.props.productList.forEach((item: IProductItemCustomer) => {

      this.renderProductItem(item, count);
      count++;
    });
  }
  renderCampaignProductsList() {
    let campaignProductList = this.props.productList.filter(e => e.isCampaign === true)
    if (campaignProductList && campaignProductList.length > 0) {

      return (
        <View style={{
          marginTop: 20, backgroundColor: '#fff', flex: 1, shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,
          elevation: 1,
        }}>

          <Text style={{ paddingLeft: 10, marginTop: 5, fontFamily: fonts.h3Font, color: '#555', fontSize: 16 }}>Kampanyalı Ürünler</Text>
          <ScrollView horizontal={true} style={{ paddingTop: 10 }} showsHorizontalScrollIndicator={false}>
            {campaignProductList.map((item: IProductItemCustomer, index) => {
              return this.renderProductItem(item, index)

            })}
          </ScrollView>
        </View>
      )
    }
  }

  render() {
    const { navigation, imageData, fetchMoreImageData, loading, campaings } = this.props;
    console.log(campaings, "data geldi");
    const { page, limit } = this.state;
    console.log("home");
    return (
      <ScrollView>
        <View style={styles.container}>
          {campaings &&
            <SliderBox
              images={this.props.campaings.map((item) => { return item.photoPath; })}
              onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
              currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
            />
          }
          {this.renderCampaignProductsList()}
          <View style={{ marginTop: 10 }}>
            <Text style={{ paddingLeft: 10, fontFamily: fonts.h3Font, color: '#555', fontWeight: '200', fontSize: 18 }}>Tüm Ürünlerimiz</Text>
          </View>

          {this.renderContent()}
        </View>
      </ScrollView>
    );
  }
  renderContent() {

    if (!this.props.productList && this.props.loading) {
      return (
        <Spinner color={colors.borderColor} />
      )
    } else {
      return (

        <FlatList
          contentContainerStyle={{ paddingTop: 5 }}
          data={this.props.productList.filter(e => e.isCampaign !== true)}

          keyExtractor={item => item.productId}
          renderItem={({ item, index }) => {
            return (
              <View style={{ marginBottom: 10, flex: .48 }}>


                <View style={styles.item}>
                  <View style={{ paddingVertical: 10, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
                    <Image
                      style={{ width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 4 }}
                      source={{ uri: item.imagePath }}
                    />
                  </View>


                  {this.renderPlusButton(item, index)}

                  <Text style={{ fontFamily: 'roboto', color: colors.textColor, width: '90%' }}>
                    {item.productName}
                  </Text>
                  <Text style={{ fontFamily: fonts.primaryFont, marginTop: 5, color: colors.priceAndPlusColor, fontWeight: 'bold' }}>
                    {item.price} TL
           </Text>
                </View>

              </View>
            );
          }}
          numColumns={2}

        />
      )
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  loading: state.CustomerproductForCustomer.loading,
  productList: state.CustomerproductForCustomer.productList,
  loadingIndex: state.CustomerproductForCustomer.loadingIndex,
  loadingIncDec: state.CustomerproductForCustomer.loadingIncDec,
  campaings: state.CustomerproductForCustomer.campaings
});

function bindToAction(dispatch: any) {
  return {
    GetProductsForCustomer: (productsList?: IProductItemCustomer[]) =>
      dispatch(GetProductsForCustomer(productsList)),
    GetCampaignHome: () =>
      dispatch(GetCampaignHome()),
    IncOrDecItemFromCart: (productsList: IProductItemCustomer[], productId: number, isIncrease: boolean, index?: number) =>
      dispatch(IncOrDecItemFromCart(productsList, productId, isIncrease, index)),
    getUserInfo: () => dispatch(getUserInfo()),
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(CustomerHomeScreen);