import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, Button, Text, Image, Dimensions, TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback } from "react-native";
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
import { getUserInfo, UserInfo } from "../../../redux/actions/profileActions";
import Icon from "react-native-vector-icons/Feather";
import { SliderBox } from "react-native-image-slider-box";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import RBSheet from "react-native-raw-bottom-sheet";
import { appKilled } from "../../../redux/actions/loginAction";
import { showSimpleMessage } from "../../../components/showMessage";
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
  userInfo: UserInfo;
}

interface itemProp {
  item: any;
}

interface State {
  page: number;
  limit: number;
  change: boolean;
  images: string[];
  selectedItemId: number;
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

      ],
      selectedItemId: 0

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

  renderItemsForProduct() {
    let item = this.props.productList.find(e=>e.productId === this.state.selectedItemId) ?? null
    let itemIsFirsat = item?.isCampaign === true
    if(item) {
      return(
        <View style={{flex:1,backgroundColor:'white'}}>
        <Text style={{fontFamily:fonts.primaryFont,fontSize:18,textAlign:'center',marginTop:10,marginHorizontal:30}}>{item.productName}</Text>
        <TouchableOpacity onPress={()=> this.RBSheetItem.close()} style={{position:'absolute',right:5,top:10}}>
            <Icon name="x" style={{fontSize:20}} />
          </TouchableOpacity>
  
          <View style={{justifyContent:'space-between',flex:1}}>
            <View>
          <FastImage
          style={{ width: Dimensions.get('window').width/1.5 , height: Dimensions.get('window').width/1.5 ,justifyContent:'center',alignSelf:'center',marginTop:10}}
          source={{
              uri: item.imagePath,
              priority: FastImage.priority.normal,
          }}
      />
       {itemIsFirsat ? <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                <Text style={{ fontFamily: fonts.primaryFont, fontSize: 25, marginTop: 5, color: colors.textColorLighter, textDecorationLine: "line-through" }}>
                  {item.price}
                </Text>
                <Text style={{ marginLeft: 5, fontFamily: fonts.primaryFont, fontSize: 25, marginTop: 5, color: colors.priceAndPlusColor, fontWeight: 'bold' }}>
                  {item.newPrice} TL
      </Text>
              </View> : <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                <Text style={{ marginLeft: 5, fontFamily: fonts.primaryFont, fontSize: 25, marginTop: 5, color: colors.priceAndPlusColor, fontWeight: 'bold' }}>
                  {item.price} TL
      </Text>
              </View>}
              </View>
          </View>
      {this.renderPlusButtonForRBSheet(item)}
        </View>
      )
    }else {
      ()=> this.RBSheetItem.close()
    }
    
  }

  

  renderPlusButtonForRBSheet(item: IProductItemCustomer, index?: number) {

    if (item.count > 0) {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
        <View style={{ shadowColor: "#000",
        shadowOffset: {
          width: 5,
          height: 2,
        },
        shadowOpacity: 0.41,
        shadowRadius: 10.65,

        elevation: 3,backgroundColor:'white',paddingBottom:30,paddingTop:20,height:100,zIndex:100}}>
          {this.props.loadingIncDec && this.props.loadingIndex === item.productId && <Spinner style={{ position: "absolute", zIndex: 1, backgroundColor: colors.borderColor, opacity: .8, width: '100%', height: '100%' }} color={colors.headerColor} />}

          <View  style={{  marginBottom:20,justifyContent:'center',alignSelf:'center',flexDirection:'row'  }}>
             <TouchableOpacity style={[styles.IncOrDecButton,{height:50,width:50,borderRadius:25}]} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.productId, false);
              this.props.navigation.setParams({ cart: cart - item.price });
              this.setState({ change: !this.state.change })
            }}><Icon name="minus"
              style={{ color: colors.priceAndPlusColor, fontSize: 45 }} /></TouchableOpacity>

          
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', paddingHorizontal: 10, color: colors.textColor }}>{item.count}</Text>
           
            <TouchableOpacity  style={[styles.IncOrDecButton,{height:50,width:50,borderRadius:25}]} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.productId, true);
              this.props.navigation.setParams({ cart: cart + item.price });
              this.setState({ page: this.state.page + 1 })
            }}><Icon name="plus"
              style={{ color: colors.priceAndPlusColor, fontSize: 45 }} /></TouchableOpacity>

          </View>
        </View>
      )
    }
    else {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (

          <View style={{ justifyContent:'center',alignSelf:'center',paddingBottom:30,paddingTop:20, shadowColor: "#000",height:100,
          shadowOffset: {
            width: 5,
            height: 2,
          },
          shadowOpacity: 0.41,
          shadowRadius: 10.65,
  
          elevation: 3, backgroundColor:'white',width:Dimensions.get('window').width,zIndex:100}}>
          {this.props.loadingIncDec && this.props.loadingIndex === item.productId && <Spinner style={{ position: "absolute", zIndex: 1, backgroundColor: colors.borderColor, opacity: .8, width: '100%', height: '100%' }} color={colors.headerColor} />}

            {this.props.loadingIncDec && this.props.loadingIndex === item.productId && <Spinner style={{ zIndex: 1, backgroundColor: colors.borderColor, opacity: .8 }} size="small" color={colors.headerColor} />}
            <TouchableOpacity  style={{backgroundColor:colors.IconColor,height:50,width:Dimensions.get('screen').width - 40,borderRadius:5,justifyContent:'center',shadowColor: "#000",alignSelf:'center',
        shadowOffset: {
          width: 5,
          height: 2,
        },
        shadowOpacity: 0.41,
        shadowRadius: 10.65,

        elevation: 3,}} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.productId, true)
              this.props.navigation.setParams({ cart: cart + item.price });
              this.setState({ change: !this.state.change })
            }}>
              <Text style={{color:'white',fontFamily:fonts.h3Font,textAlign:'center',fontSize:18}}>Sepete Ekle</Text>
            </TouchableOpacity>

        </View>

      )
    }
  }

  // componentDidUpdate(prevProps : Props, prevState : State) {

  // var totalPrice = 0;
  // this.props.productList ? this.props.productList.length > 0 ? this.props.productList.map(e=> totalPrice += e.count * e.price) : null : null;

  //     // this.props.navigation.setParams({cart : totalPrice})

  // }
  
  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Bağlar Su',

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

  checkIfFreeProductExist() {
    let userFreePoint = this.props.userInfo ? this.props.userInfo.point ? this.props.userInfo.point : 0 : 0
    var canUserBuyFreeProduct = false
    var usedFreePoint = 0
    if (userFreePoint > 0){ 
     
      let productList = this.props.productList ?? []
      for (let index = 0; index < productList.length; index++) {
        const element = productList[index];
        if (element.count > 0 && canUserBuyFreeProduct) {
          canUserBuyFreeProduct = false
          break; 
        }
        if (element.count == 1 && element.freePoint && element.freePoint <= userFreePoint) {
          canUserBuyFreeProduct = true
        }
      }
      if (canUserBuyFreeProduct) {
        showSimpleMessage("Puanlarını kullan","info","Sepetinizdeki ürünü bir adet olarak puanınızla bedava satın alabilirsiniz.")
      return (
        <TouchableHighlight

          onPress={() => this.props.navigation.navigate('CartCheckout',{freeOrder: canUserBuyFreeProduct})}
          underlayColor="#AAA"
          style={{
            borderRadius: 5,
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              marginBottom:10,
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

            <View style={{}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require('../../../assets/UCRETSIZ.png')} style={{marginRight:10,marginTop:5}} width={40} height={40} resizeMode="contain" />
              <View style={{marginTop:5}}>
              <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontWeight: '600',
                    color: '#fff',
                  }}>
                  Bu ürünü kazandığınız 
            </Text>
              <Text style={{
                fontFamily: 'Roboto',
                color: '#fff',
              }}>puanlarla almak ister misiniz?</Text>
              </View>
              </View>
              </View>
 
            <View>
                  <Icon name="chevron-right" style={{ color: 'white', marginTop: 15, fontSize: 18 }} type="Feather" />


            </View>


          </LinearGradient>
        </TouchableHighlight>
      );
    }
  }  

  }
  renderPlusButton(item: IProductItemCustomer, index: number) {

    if (item.count > 0) {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
        <View style={{ backgroundColor: '#F1F1F1', position: 'absolute', paddingLeft: 5, paddingRight: 5, paddingVertical: 5, borderRadius: 15, right: 10, bottom: 10 ,zIndex:100}}>
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
        <View style={{ position: 'absolute', top: 0, right: 0, zIndex: 10, paddingVertical: 5, paddingLeft: 5, paddingRight: 5,zIndex:100}}>
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
        <View style={{ position: 'absolute', top: 0, zIndex: 10, paddingVertical: 5, paddingLeft: 5, paddingRight: 5, right: 0 ,zIndex:100}}>
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
      <TouchableWithoutFeedback onPress={()=> this.setState({selectedItemId:item.productId}, ()=> this.RBSheetItem.open())
    }>
      <View style={{ marginBottom: 10 }}>
        <View style={styles.itemCampaign}>
          <View style={{ paddingVertical: 10, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
<FastImage
       style={{ width: Dimensions.get('window').width / 4.5, height: Dimensions.get('window').width / 5 }}
        source={{
            uri: item.imagePath,
            priority: FastImage.priority.normal,
        }}
    />
          </View>


          {this.renderPlusButtonCampaign(item, index)}

          <Text style={{ fontFamily: 'roboto', color: colors.textColor, width: '90%' }}>
          {item.productName ? item.productName.length > 25 ? item.productName.slice(0,23) + "..." : item.productName : ""}
          </Text>
          <View style={{flexDirection:'row'}}>
          <Text style={{ fontFamily: fonts.primaryFont, marginTop: 5, color: colors.textColorLighter,textDecorationLine:"line-through" }}>
    {item.price} 
      </Text>
      <Text style={{ marginLeft:5,fontFamily: fonts.primaryFont, marginTop: 5, color: colors.priceAndPlusColor, fontWeight: 'bold'}}>
    {item.newPrice} TL
      </Text>
          </View>
        </View>

      </View>
      </TouchableWithoutFeedback>

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

          <Text style={{ paddingLeft: 10, marginTop: 5, fontFamily: fonts.h3Font, color: '#555', fontSize: 16 }}>Fırsat Ürünleri</Text>
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
      <ScrollView style={{backgroundColor:colors.containerBg}} contentContainerStyle={{flexGrow:1}}>
        {this.checkIfFreeProductExist()}
        <View style={[styles.container]}>
          {campaings &&
            <SliderBox
            autoplay={true}
            circleLoop
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
          <RBSheet
          ref={ref => {
            this.RBSheetItem = ref;
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
         {this.renderItemsForProduct()}
        </RBSheet>
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
              <TouchableWithoutFeedback onPress={()=> this.setState({selectedItemId:item.productId}, ()=> this.RBSheetItem.open())
            }>
              <View style={{ marginBottom: 10, flex: .48 }}>


                <View style={styles.item}>
                  <View style={{ paddingVertical: 10, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
                    {/* <Image
                      style={{ width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 4 }}
                      source={{ uri: item.imagePath }}
                    /> */}
                    <FastImage
        style={{ width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 4 }}
        source={{
            uri: item.imagePath,
            priority: FastImage.priority.normal,
        }}
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
          </TouchableWithoutFeedback>
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
  campaings: state.CustomerproductForCustomer.campaings,
  userInfo: state.profile.userInfo,
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
