// import { connect } from "react-redux";
// import { AppState } from "../redux/store";
// import { View ,Text, Image} from "react-native";
// import React from "react";

// export default connect((state: AppState) => ({
//     notificationCount: 1,
//   }))(({ dispatch, nav,focused }) => (
//     <View>
//         {/* {focused ? <Image style={{width:24,height:24}} source={require("../assets/bell.png")} /> : <Image style={{width:24,height:24}} source={require("../assets/bell-outline.png")} /> }

//       {
//         props.notificationCount > 0 ?
//           <View style={{ position: 'absolute', right: 10, top: 5, backgroundColor: 'red', borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
//             <Text style={{ color: 'white' }}>{props.notificationCount}</Text>
//           </View> : null
//       } */}
//     </View>
//   ));


import React, { Component } from "react";
import {
  Container,
  Content,
  Text,
  View
} from "native-base";
import { connect } from "react-redux";
import { Image, Animated, Easing } from "react-native";
import { colors, sizes } from "../constants";
import { AppState } from "../redux/store";
import Icon from "react-native-vector-icons/Feather";
import { IProductItemCustomer } from "../redux/actionsCustomer/ProductAction";


interface Props {
  focused : boolean;
  productList:IProductItemCustomer[];
}

class NotiTabBarIcon extends Component<Props> {
  animatedValue: any;


  constructor(props) {
    super(props)
  }




  render(){
    var productCountInCard = 0
    let x = this.props.productList ? this.props.productList.length > 0 ? this.props.productList.map(e=>e.count > 0 ? productCountInCard = productCountInCard + 1 : null) : 0 : 0
    return (
      <View>
     {this.props.focused ? <Icon name="shopping-cart"  style={{color: colors.IconColor,fontSize:24}}  /> : 
      <Icon name="shopping-cart" style={{color: colors.IconNormalColor,fontSize:24}} / >} 
    {
        productCountInCard> 0 ?
        <View style={{ position: 'absolute', right: -15, top:-10, backgroundColor: colors.IconColor,minHeight:18,minWidth:18, borderRadius: 9,  justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white' ,fontSize:15}}>{productCountInCard}</Text>
      </View> : null
    }
    
     </View>
    )
  }
  

}
  
  



export default connect(
  (state : AppState) => ({ 
    productList: state.CustomerproductForCustomer.productList,
  })
)(NotiTabBarIcon);
