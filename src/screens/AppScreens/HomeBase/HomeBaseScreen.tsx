import React, { Component } from "react";
import { View, StyleSheet ,ImageBackground,FlatList, Text} from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { colors, fonts } from "../../../constants";
import { ListItem } from "../../../components/ListItem";
import { connect } from "react-redux";
import { AppState } from "../../../redux/store";
import {  } from "react-native";
import { Dimensions } from "react-native";
import { Image } from "react-native";
import { Item } from "native-base";
import { TouchableHighlight, TouchableWithoutFeedback } from "react-native-gesture-handler";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}


const DATA = [
  {
    id: 0,
    title: "Yazarak",
    source: require('../../../assets/base/004-whatsapp.png')
  },
  {
    id:1,
    title: "Sipariş ver",
    source: require('../../../assets/base/003-order.png')
  },
  {
    id: 2,
    title: "Arayarak",
    source: require('../../../assets/base/005-phone-call.png')
  },
  {
    id: 3,
    title: "Bildirimler",
    source: require('../../../assets/base/006-chat.png')
  },
  {
    id: 4,
    title: "Puan verin",
    source: require('../../../assets/base/007-star.png')
  },
  {
    id: 5,
    title: "Önerin",
    source: require('../../../assets/base/009-good.png')
  },
];

const ITEMWIDTH = Dimensions.get('screen').width / 3 - 30
const ImageHeightGeneral = Dimensions.get('screen').height
class HomeBaseScreen extends Component<Props, {}> {
    static navigationOptions = ({}) => {
        header: null
       };

       renderItem = ({ item }) => {
        
        return (
          <View style={{margin:15,backgroundColor:'white', shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,
          elevation: 1,borderRadius:5}}>
 <TouchableHighlight underlayColor="#AAA" onPress={()=> this.routeUser(item.id)} style={{width:ITEMWIDTH,height:ITEMWIDTH,backgroundColor:'white',borderRadius:5,
         }}>
           <View>
           <Image source={item.source} style={{width:ITEMWIDTH -50, height:ITEMWIDTH - 50,alignSelf:'center',marginTop:10}} />
            <Text style={{textAlign:'center',marginTop:10,fontFamily:fonts.h3Font,color:colors.textColorLighter}}>{item.title}</Text>
           </View>
          </TouchableHighlight>
          </View>
         
        );
      };
      
routeUser(id:Number) {
  if(id===0) {
    Linking.openURL(`whatsapp://send?text=${"Merhaba ozansu sipariş vermek istiyorum"}&phone=xxxxxxxxxxxxx`)
  }
  if(id === 1) {
this.props.navigation.navigate('AppStack')
  }
}
  render() {
    const { navigation } = this.props;
    return (


<ImageBackground
  source={require('../../../assets/waterBg-2.jpg')}
  style={{flex:1,opacity:1}}
> 
<View style={{flex:1,backgroundColor: 'rgba( 0, 0, 0,0.01 )'}}>


<View style={{backgroundColor:'white',height:200,width:200,marginTop:ImageHeightGeneral / 7,justifyContent:'center',alignSelf:'center',borderRadius:100,  shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,
          elevation: 1}}>
<Image style={{alignSelf:'center'}} source={require('../../../assets/BaseImage.png')} />
</View>
<FlatList
bounces={false}
contentContainerStyle={{position:'absolute',bottom:30}}
data={DATA}
renderItem={this.renderItem}
numColumns={3}
/>
</View>
</ImageBackground>

    );
  }
}


const mapStateToProps = (state: AppState) => ({
  });
  
  function bindToAction(dispatch: any) {
    return {
    };
  }
  
  export default connect(
    mapStateToProps,
    bindToAction
  )(HomeBaseScreen);
  