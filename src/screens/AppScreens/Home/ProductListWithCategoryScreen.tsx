import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, Button, Text, Image, Dimensions, TouchableOpacity,TouchableHighlight } from "react-native";
import { NavigationScreenProp, NavigationState, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Header } from "../../../components";
import styles from "../styles";
import { AvatarItem } from "../../../components";
import { logoutUserService } from "../../../redux/services/user";
import { Thumbnail, Spinner, Item } from 'native-base'
import {
  fetchImageData,
  fetchMoreImageData
} from "../../../redux/actions/fetch";

import FlashMessage, { showMessage } from "react-native-flash-message";
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
import FastImage from "react-native-fast-image";
import { Category } from "../../../redux/actions/categoryAction";

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
  categoryList: Category[]
}

interface itemProp {
  item: any;
}

interface State {
  page: number;
  limit: number;
  change: boolean;
  images: string[];
  categories : Category[];
  selectedBaseCategoryId: number;
  selectedSecondCategoryId: number;
  categoryId:number
  categorySecondList: Category[]
}



const MyTitle = ({ navigation, productList }) => <TotalPriceText productList={productList} navigation={navigation} />;
const MyConnectedTitle = connect((storeState: AppState) => ({ productList: storeState.CustomerproductForCustomer.productList }))(MyTitle);


const categoryImageEt = require('../../../images/Category/et.jpg')
const categoryImageElektronik = require('../../../images/Category/elektronik.jpg')
const categoryImageicecek = require('../../../images/Category/icecek.jpg')
const categoryImagekozmetik = require('../../../images/Category/kozmetik.jpg')
const categoryImagemeyveSebze = require('../../../images/Category/meyveSebze.jpg')
const categoryImagesutUrunleri = require('../../../images/Category/sutUrunleri.jpg')
const categoryImagesutTemizlik = require('../../../images/Category/temizlik.jpg')
const categoryCampaign = require('../../../images/Category/CampaignBakkal.png')

class ProductListWithCategoryScreen extends Component<Props, State> {
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
      categories : [{id:1,name:'Süt ve süt ürünleri',image: categoryImagesutUrunleri},
      {id:1,name:'Et ve balık',image: categoryImageEt},
      {id:1,name:'İçecek',image: categoryImageicecek},
      {id:1,name:'Meyve sebze',image: categoryImagemeyveSebze},
      {id:1,name:'Temizlik',image: categoryImagesutTemizlik},
      {id:1,name:'Kozmetik',image:categoryImagekozmetik},
      {id:1,name:'Elektronik',image: categoryImageElektronik}],
      selectedBaseCategoryId: 0,
      selectedSecondCategoryId: 0,
      categoryId:0,
      categorySecondList: []

    };

  }

  componentDidMount() {
    let categoryId =  Number(this.props.navigation.getParam('categoryId'))
    let categoryList =this.props.categoryList.filter(e=> e.categoryParentId === categoryId)
    if(categoryList && categoryList.length > 0) {
      this.setState({selectedBaseCategoryId : categoryList[0].id})
    }
    this.setState({categoryId:categoryId,categorySecondList: categoryList})

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
      title: 'Fill Market',

      headerStyle: {
        backgroundColor: colors.headerColorTop,
        headerTitleStyle: {
          fontFamily: 'Roboto',
         
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
        <View style={{  position: 'absolute', borderRadius: 15, right: 10, bottom: 10 }}>
          {this.props.loadingIncDec && this.props.loadingIndex === item.id && <Spinner style={{ position: "absolute", zIndex: 1, backgroundColor: colors.borderColor, opacity: .8, width: '100%', height: '100%' }} color={colors.headerColor} />}

          <View style={{
            flexDirection: 'row', 
            // shadowColor: "#000",
            // shadowOffset: {
            //   width: 0,
            //   height: 3,
            // },
            // shadowOpacity: 0.29,
            // shadowRadius: 4.65,

            // elevation: 3,
          }}>
             <TouchableOpacity style={styles.IncOrDecButton} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.id, false);
              this.props.navigation.setParams({ cart: cart - item.price });
              this.setState({ change: !this.state.change })
            }}><Icon name="minus"
              style={{ color: colors.priceAndPlusColor, fontSize: 20 }} /></TouchableOpacity>

          
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', paddingHorizontal: 5, color: colors.textColor }}>{item.count}</Text>
           
            <TouchableOpacity style={styles.IncOrDecButton} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.id, true);
              this.props.navigation.setParams({ cart: cart + item.price });
              this.setState({ page: this.state.page + 1 })
            }}><Icon name="plus"
              style={{ color: colors.priceAndPlusColor, fontSize: 20 }} /></TouchableOpacity>

          </View>
        </View>
      )
    }
    else {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
        <View style={{ position: 'absolute',  borderRadius: 15, right: 10, bottom: 10 }}>
          {this.props.loadingIncDec && this.props.loadingIndex === item.id && <Spinner style={{ position: "absolute", zIndex: 1, backgroundColor: colors.borderColor, opacity: .8, width: '100%', height: '100%' }} color={colors.headerColor} />}

          <View style={{
            flexDirection: 'row',
            //  shadowColor: "#000",
            // shadowOffset: {
            //   width: 0,
            //   height: 3,
            // },
            // shadowOpacity: 0.29,
            // shadowRadius: 4.65,

            // elevation: 3,
          }}>
            {this.props.loadingIncDec && this.props.loadingIndex === item.id && <Spinner style={{ zIndex: 1, backgroundColor: colors.borderColor, opacity: .8 }} size="small" color={colors.headerColor} />}
            <TouchableOpacity style={styles.IncOrDecButton} onPress={() => {
              this.props.IncOrDecItemFromCart(this.props.productList, item.id, true)
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
<FastImage
       style={{ width: Dimensions.get('window').width / 4.5, height: Dimensions.get('window').width / 5 }}
        source={{
            uri: item.photoPath,
            priority: FastImage.priority.normal,
        }}
    />
          </View>


          {this.renderPlusButtonCampaign(item, index)}

          <Text style={{ fontFamily: 'roboto', color: colors.textColor, width: '90%' }}>
            {item.productName}
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
          marginTop: 0, backgroundColor: '#fff', flex: 1, shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,
          elevation: 1,
        }}>

          <Text style={{ paddingLeft: 10, marginTop: 5, fontFamily: fonts.h3Font, color: '#555', fontSize: 16 }}>Fırsat Ürünleri</Text>
          <ScrollView horizontal={true} style={{ paddingTop: 10 }} showsHorizontalScrollIndicator={false}>
            {campaignProductList.reverse().map((item: IProductItemCustomer, index) => {
              return this.renderProductItem(item, index)

            })}
          </ScrollView>
        </View>
      )
    }
  }
//   renderCategory() {

//     let width = Dimensions.get('window').width / 3 - 20 
//     return(
//       <View style={{ marginTop: 10 }}>
//       <Text style={{ paddingLeft: 10, fontFamily: fonts.h3Font, color: '#555', fontWeight: '200', fontSize: 18 }}>Kategoriler</Text>
//       <FlatList
//           contentContainerStyle={{ paddingTop: 5 }}
//           data={ }
// // Here is the magic : snap to the center of an item
// snapToAlignment={'center'}  
// // Defines here the interval between to item (basically the width of an item with margins)
// snapToInterval={Dimensions.get('window').width / 5}    
//           keyExtractor={item => item.id}
//           renderItem={({ item, index }) => {
//             return (
//               <TouchableHighlight underlayColor="#AAA" onPress={()=> console.log()} style={[styles.item,{paddingBottom:0,height:130,paddingLeft:0,marginBottom: 10,width:width }]}>


//                 <View style={[{}]}>
//                   <View style={{ paddingVertical: 10, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
//                     {/* <Image
//                       style={{ width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 4 }}
//                       source={{ uri: item.imagePath }}
//                     /> */}
//                     <Image
//         style={{ width: Dimensions.get('window').width / 6, height: Dimensions.get('window').width / 6 }}
//         source={{uri: item.photoPath ?? ""}}
//     />
//                   </View>

//                   <Text style={{ fontFamily: 'roboto', color: colors.textColor, width: '95%' ,textAlign:'center'}}>
//                     {item.name}
//                   </Text>
//                 </View>

//               </TouchableHighlight>
//             );
//           }}
//           numColumns={3}

//         />
//     </View>
//     )
//   }

  scrollToIndex(index: number,item:Category){
    this.setState({selectedBaseCategoryId:item.id})
    let randomIndex = index
    this.flatListRef.scrollToIndex({animated: true, index: randomIndex,viewOffset: Dimensions.get('window').width / 2.5,});
    this.flatListRefSecond.scrollToIndex({animated: true,index:index})
    // this.flatListRefSecond.scrollToIndex({animated: true, index: randomIndex,viewOffset: Dimensions.get('window').width / 2.5,});
    // this.flatListRefSecond.scrollToIndex({animated: true, index: randomIndex});

  }
  scrollToIndexSecond(index: number){
    let itemId = this.state.categorySecondList[index].id ?? 0
    this.setState({selectedBaseCategoryId:itemId})
    let categorilist = [{id:1,name:"Taze Yemek"},{id:2,name:"Atistirmalik"},{id:3,name:"Meyve sebze"},{id:4,name:"Yiyecek"},{id:5,name:"Yok"}]
    let randomIndex = index
    this.flatListRef.scrollToIndex({animated: true, index: randomIndex,viewOffset: Dimensions.get('window').width / 2.5,});

  }

renderTopCategoryItems() {

  return (
    <View style={{backgroundColor:colors.IconColor,height:50}}>
         
    <FlatList 
    ref={(ref) => { this.flatListRef = ref; }}
    horizontal

    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{height:50}}
    data={this.state.categorySecondList}
    renderItem= {({index,item}) => 
    <TouchableHighlight underlayColor={colors.IconColorLighter} onPress={()=> this.scrollToIndex(index,item)} style={{borderWidth:1,borderColor:this.state.selectedBaseCategoryId === item.id ? colors.IconColor : 'white',height:30,justifyContent:'center',marginLeft:20,alignSelf:'center',padding:5,borderRadius:5,backgroundColor:this.state.selectedBaseCategoryId === item.id ? 'white':colors.IconColor }}>
    <Text style={{color:this.state.selectedBaseCategoryId === item.id ? colors.IconColor : 'white',fontFamily:fonts.primaryFont}}>{item.name}</Text>
  </TouchableHighlight>
  }
  ListFooterComponent={() =>
  <View style={{width:20}}/>}
    />
      </View>

  )
}


onViewableItemsChanged = ({ viewableItems, changed }) => {
  console.log("Visible items are", viewableItems);

  console.log("Changed in this iteration", changed);
  let index = changed ? changed.length ? 0 : 0 : 0
  let ItemIndex = viewableItems[index] ? viewableItems[index] : 0
  if(ItemIndex !== 0) {
    console.log(ItemIndex)
    this.setState({selectedItemIndex:ItemIndex })
  }
 

  
}

// onViewableItemsChanged = ({viewableItems}) => {
    
//   // Get the first viewable item
//   const firstViewItem = viewableItems[0].key;
//   // Get its index into the items
//   const index = this.state.items.findIndex(item => item.key === firstViewItem);
//   // If the index is a multiple of the number of items displayable on the screen
//   // by checking for a reminder on the modulo operation
//   if ((index % NB_ITEMS_SCREEN) === 0) {
//     // get page
//     const currentPage = index / NB_ITEMS_SCREEN;
//     if (currentPage !== this.state.currentPage) {
//       this.setState({
//         currentPage: currentPage,
//       })
//     }
//   }
// }




viewabilityConfig = {
        viewAreaCoveragePercentThreshold: 33,

};

handleScroll = (event) => {
  let yOffset = event.nativeEvent.contentOffset.x
  let contentHeight = event.nativeEvent.contentSize.width
  let value = yOffset / contentHeight
  console.log(value)
}


renderSecondCategoryItems() {
let list = this.props.productList.filter(e=>e.categoryId === this.state.selectedBaseCategoryId)
let width = Dimensions.get('window').width / 3
  return (

         
    
    <FlatList
    ref={(ref) => { this.flatListRefSecond = ref; }}
    // style={{flex:1}}
    horizontal  
    alwaysBounceVertical
    data={this.state.categorySecondList}
    pagingEnabled
    keyExtractor={item => item.id}
    contentContainerStyle={{width:Dimensions.get('window').width * this.state.categorySecondList.length}}
    // viewabilityConfig={this.viewabilityConfig}
    onScrollEndDrag={(event) => {
      let yOffset = event.nativeEvent.contentOffset.x
  let contentHeight = event.nativeEvent.contentSize.width
  let value = yOffset / contentHeight
  let index = Math.round(value * this.state.categorySecondList.length)
      console.log(event)
  console.log("index",index)
      this.scrollToIndexSecond(index)
    }}

    onScroll={this.handleScroll}
    onViewableItemsChanged={this.onViewableItemsChanged}
    
    renderItem={({item}) => 
  <View>
    <Text style={{margin:5,marginLeft:10,fontFamily:fonts.primaryFont,fontSize:16,fontWeight:"900",color:colors.textColorMoreLighter}}>{item.name}</Text>

    <FlatList

    data={this.props.productList.filter(e=>e.categoryId === item.id)}
    contentContainerStyle={{width: Dimensions.get('window').width}}
    renderItem={({ item, index }) => {
      return (
        <View style={{ marginBottom: 10, width:width }}>
          <View style={styles.item}>
            <View style={{ paddingVertical: 10, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
              {/* <Image
                style={{ width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 4 }}
                source={{ uri: item.imagePath }}
              /> */}
              <FastImage
  style={{ width: Dimensions.get('window').width / 5, height: Dimensions.get('window').width / 5   }}
  source={{
      uri: item.photoPath,
      priority: FastImage.priority.normal,
  }}
/>
            </View>


            {this.renderPlusButton(item, index)}

            <Text style={{ fontFamily: 'roboto', color: colors.textColor, width: '90%' }}>
              {item.productName}
            </Text>
            {item.isCampaign ?  <View style={{flexDirection:'row'}}>
          <Text style={{ fontFamily: fonts.primaryFont, marginTop: 5, color: colors.textColorLighter,textDecorationLine:"line-through" }}>
    {item.price} 
      </Text>
      <Text style={{ marginLeft:5,fontFamily: fonts.primaryFont, marginTop: 5, color: colors.priceAndPlusColor, fontWeight: 'bold'}}>
    {item.newPrice} TL
      </Text>
          </View>
          :<Text style={{ fontFamily: fonts.primaryFont, marginTop: 5, color: colors.priceAndPlusColor, fontWeight: 'bold' }}>
          {item.price} TL
 </Text>}
            
          </View>

        </View>

);
    }}
    numColumns={3}

  />
  </View>}
   
   
   />


  )
}

renderProducts() {

}
  render() {
    const { navigation, imageData, fetchMoreImageData, loading, campaings } = this.props;
    console.log(campaings, "data geldi");
    const { page, limit } = this.state;
    console.log("home");
    let baseCategories = this.props.categoryList ? this.props.categoryList.length > 0 ? this.props.categoryList.filter(e=>e.categoryParentId === 0) : [] : []
    return (
     
        <View style={[styles.container]}>

         {this.renderTopCategoryItems()}
         <ScrollView style={{backgroundColor:colors.containerBg}} contentContainerStyle={{flexGrow:1}}>

         {this.renderSecondCategoryItems()}
         {/* {this.renderProducts()} */}
          {/* <View style={{ marginTop: 10 }}>
            <Text style={{ paddingLeft: 10, fontFamily: fonts.h3Font, color: '#555', fontWeight: '200', fontSize: 18 }}>Tüm Ürünlerimiz</Text>
          </View> */}

          {/* {this.renderContent()} */}
          </ScrollView>
        </View>


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
                    {/* <Image
                      style={{ width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 4 }}
                      source={{ uri: item.imagePath }}
                    /> */}
                    <FastImage
        style={{ width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 4 }}
        source={{
            uri: item.photoPath,
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
  categoryList: state.categories.categoryList
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
)(ProductListWithCategoryScreen);
