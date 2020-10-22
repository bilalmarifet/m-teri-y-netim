import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, Button, Text, Image, Dimensions, TouchableOpacity,TouchableHighlight } from "react-native";
import { NavigationScreenProp, NavigationState, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Header } from "../../../components";
import styles from "../styles";
import { AvatarItem } from "../../../components";
import { logoutUserService } from "../../../redux/services/user";
import { Thumbnail, Spinner, Item, Input } from 'native-base'
import {
  fetchImageData,
  fetchMoreImageData
} from "../../../redux/actions/fetch";

import { showMessage } from "react-native-flash-message";
import { colors, fonts } from "../../../constants";
import LinearGradient from 'react-native-linear-gradient';
import { AppState } from "../../../redux/store";
import { IProductItem } from "../../../redux/models/productModel";
import { GetProductsForCustomer, IProductItemCustomer, IncOrDecItemFromCart, ICampaignItem, GetCampaignHome, getFilteredProductList } from "../../../redux/actionsCustomer/ProductAction";
import { TotalPriceText } from "../../../components/TotalPriceText";
import { getUserInfo } from "../../../redux/actions/profileActions";
import Icon from "react-native-vector-icons/Feather";
import { SliderBox } from "react-native-image-slider-box";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { Category } from "../../../redux/actions/categoryAction";
import  SearchComponent  from "../../../components/SearchComponent";
import NotiTabBarIcon from "../../../components/NotiTabBarIcon";
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons'
interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  productList: IProductItemCustomer[]
  loading: boolean;
  GetProductsForCustomer: (productsList?: IProductItemCustomer[]) => void;
  IncOrDecItemFromCart: (productsList: IProductItemCustomer[], productId: number, isIncrease: boolean, index?: number) => void;
  getFilteredProductList: (productList:IProductItemCustomer[]) => void;
  GetCampaignHome: () => void;
  loadingIndex: number;
  getUserInfo: () => void;
  loadingIncDec: boolean;
  campaings: ICampaignItem[];
  categoryList: Category[]
  filteredProductList: IProductItemCustomer[]

}

interface itemProp {
  item: any;
}

interface State {

  categories : Category[];
  filteredProduct: IProductItemCustomer[];
  searchText: String;
  isSearchedNotFound: boolean;
}


class CustomerHomeScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state ={
        filteredProduct: [],
        searchText: ""
    }
  }

  componentDidMount() {
    
  }

  // componentDidUpdate(prevProps : Props, prevState : State) {

  // var totalPrice = 0;
  // this.props.productList ? this.props.productList.length > 0 ? this.props.productList.map(e=> totalPrice += e.count * e.price) : null : null;

  //     // this.props.navigation.setParams({cart : totalPrice})

  // }


  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Fill Market',

      headerStyle: {
        backgroundColor: colors.headerColorTop,
        headerTitleStyle: {
          fontFamily: 'Roboto',
         
        },
        elevation: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc'
      },

     header: null
      
    }
  };


  componentDidUpdate(prevProps: Props) {
   if ( this.props.productList !== prevProps.productList) {
       let val = this.state.filteredProduct
        this.changeTextValue(this.state.searchText)
   }
  }


  changeTextValue(e) {
    this.setState({searchText: e})
    if(e && e.length > 2 && this.props.productList && this.props.productList.length > 0) {
      console.log(e)
        let value = this.props.productList.filter(element => {
            console.log(element.productName.toLowerCase())
          let productName = element.productName ? element.productName.toLowerCase() : "" 
          let productCategory = element.categoryName ? element.categoryName.toLowerCase() : "" 
          let productParentCategory = element.categoryParentName ? element.categoryParentName.toLowerCase() : "" 
          console.log(productName,productCategory,productParentCategory)
            let ourText = e.toLowerCase()
          return productName.indexOf(ourText) > -1 || productCategory.indexOf(ourText) > -1 || productParentCategory.indexOf(ourText) > -1
        })

        this.setState({filteredProduct: value ?? []})
        if(value.length === 0 ) {
            this.setState({isSearchedNotFound: true})
        }
    }else if (this.state.filteredProduct.length !== 0){
        this.setState({filteredProduct: [],isSearchedNotFound:false})
    }
    
  }


  renderPlusButton(item: IProductItemCustomer, index: number) {

    if (item.count > 0) {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
        <View style={{  position: 'absolute', borderRadius: 15, right: 10, bottom: 10 }}>
          {this.props.loadingIncDec && this.props.loadingIndex === item.id && <Spinner style={{ position: "absolute", zIndex: 1, backgroundColor: colors.borderColor, opacity: .8, width: '100%', height: '100%' }} color={colors.headerColor} />}

          <View style={{
            flexDirection: 'row', 
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

  render() {
 
    return (
      <View style= {[styles.container]}>
    <SafeAreaView>
    <View>
  <Item
    style={{
      borderBottomWidth: 0,
      backgroundColor: '#EFF3F9',
      paddingVertical: 0,
      paddingLeft: 10,
    //   marginLeft: 20,
    //   marginRight: 20,
      borderRadius: 10,
      height:50,
      width:Dimensions.get('window').width,
    //   marginBottom: -10,
      shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.11,
            shadowRadius: 10.65,

            elevation: 3,
    }}>
    <Icon name="search" style={{fontSize:25}} />
    <Input
      onChangeText={e => this.changeTextValue(e)}
      returnKeyLabel="Go"
      returnKeyType="go"
      // value={this.state.searchText}
      placeholder="Ara"
      style={{fontFamily: fonts.h3Font}}
    />
  </Item>


</View>
   
  <ScrollView >
  {this.renderContent()}
  </ScrollView>
</SafeAreaView>
      </View>
    );
  }
    renderContent() {
        let width = Dimensions.get('window').width / 3
       if(this.state.filteredProduct && this.state.filteredProduct.length > 0) {
           return(
            <FlatList

            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            
            
            data={this.state.filteredProduct}
            contentContainerStyle={{width: Dimensions.get('window').width,marginTop:20,marginBottom:50}}
            renderItem={({ item, index }) => {
            return (
              <View style={{ marginBottom: 10, width:width }}>
                <View style={styles.item}>
                  <View style={{ paddingVertical: 10, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
            
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
           )
       }else if (this.state.isSearchedNotFound) {
           return (
               <View style={{alignItems:'center',justifyContent:'center',marginTop:'50%',marginBottom:100}}>
                   <IconMaterial name="cloud-search-outline"  style={{fontSize:100,color:colors.IconColor,marginBottom:10}}/>
                   <Text style={{fontFamily:fonts.h3Font,fontSize:18}}>Aradığınız kriterde ürün bulunamadı.</Text>
               </View>
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
  categoryList: state.categories.categoryList,
  filteredProductList: state.filteredProduct.filteredProductList
  
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
    getFilteredProductList: (productList:IProductItemCustomer[]) => 
    dispatch(getFilteredProductList(productList))
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(CustomerHomeScreen);
