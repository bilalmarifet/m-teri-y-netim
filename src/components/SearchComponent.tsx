








import React, { Component } from "react";
import {
  Container,
  Content,
  Input,
  Item,
  Text,
  View
} from "native-base";
import { connect } from "react-redux";
import { Image, Animated, Easing, Dimensions } from "react-native";
import { colors, fonts, sizes } from "../constants";
import { AppState } from "../redux/store";
import Icon from "react-native-vector-icons/Feather";
import { getFilteredProductList, IProductItemCustomer } from "../redux/actionsCustomer/ProductAction";


interface Props {
  focused : boolean;
  productList:IProductItemCustomer[];
  getFilteredProductList: (productList:IProductItemCustomer[]) => void;
}

class SearchComponent extends Component<Props> {
  constructor(props) {
    super(props)
  }

  changeTextValue(e) {
    this.setState({searchText: e})
    if(e && e.length > 2 && this.props.productList && this.props.productList.length > 0) {
      console.log(e)
        let value = this.props.productList.filter(element => {

          return element.productName.indexOf(e) > -1
        })

       this.props.getFilteredProductList(value)
    }
    
  }



  render(){

    return (
          
  <View>
  <Item
    style={{
      borderBottomWidth: 0,
      backgroundColor: '#EFF3F9',
      paddingVertical: 0,
      paddingLeft: 10,
      marginLeft: 20,
      marginRight: 20,
      borderRadius: 15,
      height:50,
      width:Dimensions.get('window').width,
      marginBottom: -10,
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
    ) 
    
  }
  

}
const mapStateToProps = (state: AppState) => ({
  productList : state.CustomerproductForCustomer.productList
  
});

function bindToAction(dispatch: any) {
  return {

    getFilteredProductList: (productList:IProductItemCustomer[]) => 
    dispatch(getFilteredProductList(productList))
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(SearchComponent);
  






