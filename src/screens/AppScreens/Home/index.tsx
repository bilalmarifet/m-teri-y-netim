import React, { Component } from "react";
import { View, FlatList, ActivityIndicator,Button,Text, Image, Dimensions} from "react-native";
import { NavigationScreenProp, NavigationState, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Header } from "../../../components";
import styles from "../styles";
import { AvatarItem } from "../../../components";
import { logoutUserService } from "../../../redux/services/user";
import {Thumbnail,Icon, Spinner} from 'native-base'
import {
  fetchImageData,
  fetchMoreImageData
} from "../../../redux/actions/fetch";
import { TouchableOpacity } from "react-native-gesture-handler";
import { showMessage } from "react-native-flash-message";
import { colors, fonts } from "../../../constants";
import LinearGradient from 'react-native-linear-gradient';
import { AppState } from "../../../redux/store";
import { IProductItem } from "../../../redux/models/productModel";
import { GetProductsForCustomer, IProductItemCustomer, IncOrDecItemFromCart } from "../../../redux/actionsCustomer/ProductAction";
import { TotalPriceText } from "../../../components/TotalPriceText";
import { getUserInfo } from "../../../redux/actions/profileActions";



interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  productList : IProductItemCustomer[]
  loading: boolean;
  GetProductsForCustomer : (productsList?: IProductItemCustomer[]) => void;
  IncOrDecItemFromCart : (productsList: IProductItemCustomer[],productId : number,isIncrease : boolean, index? : number) => void;
  loadingIndex : number;
  getUserInfo: () => void;
  loadingIncDec :boolean;
}

interface itemProp {
  item: any;
}

interface State {
  page: number;
  limit: number;
  change :boolean;
}



const MyTitle = ({ navigation, productList }) => <TotalPriceText productList={productList} navigation={navigation} />;
const MyConnectedTitle = connect((storeState : AppState) => ({ productList: storeState.CustomerproductForCustomer.productList }))(MyTitle);





class CustomerHomeScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
      limit: 20,
      change : false,
    };
  }

  componentDidMount() {
    this.props.GetProductsForCustomer(this.props.productList)
    var TotalPrice = 0;
    this.props.productList ? this.props.productList.map(e=> TotalPrice += e.price * e.count  ) : null
    this.props.navigation.setParams({cart : TotalPrice})
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

  static navigationOptions = ({navigation }) => {

   return {
    title: 'Ürünler',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: colors.headerColor,
      headerTitleStyle: {
        fontWeight: '600',
        fontFamily: 'Avenir Next',
        fontSize: 50
      },

    },
  headerRight: 
  <MyConnectedTitle navigation={navigation} />
   }
  };
  renderPlusButton(item : IProductItemCustomer,index : number){
  
    if(item.count > 0) {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
        <View style={{marginRight:-5,marginTop:-10,marginLeft:20,marginBottom:-10,justifyContent:'space-between',flex:1}}>
         {this.props.loadingIncDec && this.props.loadingIndex === item.productId &&  <Spinner style={{position:"absolute",zIndex:1,backgroundColor:colors.borderColor,opacity:.8,width:'100%',height:'100%'}} color={colors.headerColor} />} 

        <TouchableOpacity style={{backgroundColor:colors.headerColor,flex:1,justifyContent:'center',width:22,height:22,borderRadius:11}} onPress={()=> {
            this.props.IncOrDecItemFromCart(this.props.productList,item.productId,true);
           this.props.navigation.setParams({cart: cart + item.price});
            this.setState({page:this.state.page + 1})}}><Icon name="plus" type="MaterialCommunityIcons" style={{color:'white',fontSize:22}} /></TouchableOpacity>
          <Text style={{alignSelf:'center',marginRight:10,marginLeft:-10}}>{item.count}</Text>
          <TouchableOpacity style={{backgroundColor:colors.headerColor,flex:1,justifyContent:'center',width:22,height:22,borderRadius:11}} onPress={()=> {
            this.props.IncOrDecItemFromCart(this.props.productList,item.productId,false);
            this.props.navigation.setParams({cart: cart - item.price});
            this.setState({change : !this.state.change})}}><Icon name="minus" type="MaterialCommunityIcons" style={{color:'white',fontSize:22}} /></TouchableOpacity>
          
          

       </View>
      )
    }
    else {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
//         <TouchableOpacity onPress={()=> {
        
// <Icon name="ios-add-circle" style={{color : colors.iconColorSecond}}/>
//        </TouchableOpacity>


<View style={{marginRight:-5,marginTop:-10,marginLeft:20,marginBottom:-10}}>


{this.props.loadingIncDec && this.props.loadingIndex === item.productId &&  <Spinner style={{position:"absolute",zIndex:1,backgroundColor:colors.borderColor,opacity:.8,width:'100%',height:'100%'}} size="small" color={colors.headerColor} />} 
<TouchableOpacity style={{backgroundColor:colors.headerColor,justifyContent:'center',width:22,height:22,borderRadius:11}} onPress={()=> {
    this.props.IncOrDecItemFromCart(this.props.productList,item.productId,true)
   this.props.navigation.setParams({cart: cart + item.price});
   this.setState({change : !this.state.change})}}>

<Icon name="plus" type="MaterialCommunityIcons" style={{color:'white',fontSize:22}}  /></TouchableOpacity>
</View>

     )
    }
  }

  render() {
    const { navigation, imageData, fetchMoreImageData, loading } = this.props;
    const { page, limit } = this.state;
    return (
      <View style={styles.container}>
       
      
      {this.renderContent()}
      </View>
    );
  }
  renderContent() {
   if(!this.props.productList && this.props.loading) {
     return (
       <Spinner color={colors.borderColor} />
     )
   }else {
   return(
    <FlatList
    contentContainerStyle={{paddingTop:20}}
      data={[...this.props.productList,...this.props.productList,...this.props.productList,...this.props.productList,...this.props.productList,...this.props.productList,]}

      keyExtractor={item => item.productId}
      renderItem={({item, index}) => {
        return (
          <View style={{marginBottom:10,flex:.48}}>

         
         <View style={styles.item}>
          <View style={{paddingVertical:10}}>
          <Image
              style={{width: Dimensions.get('window').width/3.5, height: Dimensions.get('window').width/4}}
              source={require('../../../assets/bread.jpg')}
            />
           </View>

        <View style={{height:'100%'}}>
        {this.renderPlusButton(item,index)}
          </View>
         
           </View>
           <Text style={{fontFamily:fonts.primaryFont,color:colors.textColor,fontWeight:'bold',marginLeft:15}}>
             {item.productName}
           </Text>
           <Text style={{fontFamily:fonts.primaryFont,marginTop:5,color:colors.textColorSecond,marginLeft:15}}>
             {item.price} TL
           </Text>
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
  productList : state.CustomerproductForCustomer.productList,
  loadingIndex : state.CustomerproductForCustomer.loadingIndex,
  loadingIncDec :state.CustomerproductForCustomer.loadingIncDec,
});

function bindToAction(dispatch: any) {
  return {
    GetProductsForCustomer : (productsList?: IProductItemCustomer[]) => 
    dispatch(GetProductsForCustomer(productsList)),
    IncOrDecItemFromCart : (productsList: IProductItemCustomer[],productId : number,isIncrease : boolean, index? : number) => 
    dispatch(IncOrDecItemFromCart(productsList,productId,isIncrease,index)),
    getUserInfo: () => dispatch(getUserInfo()),
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(CustomerHomeScreen);
