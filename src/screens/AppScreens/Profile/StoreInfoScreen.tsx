import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  Alert,
  Image, AsyncStorage, Linking, Platform
} from 'react-native';
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
import {
  Thumbnail,
  Item,
  Label,
  Input,
  List,
  ListItem,
  Body,
  Right,
  Left,Spinner
} from 'native-base';
import {TouchableOpacity,TouchableHighlight, ScrollView} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {colors, fonts} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';

import * as Yup from 'yup'; // for everything

import {Formik} from 'formik';
import {getStoreInformationFromStoreId, getUserInfo, storeInformation, UserInfo} from '../../../redux/actions/profileActions';
import {logOut} from '../../../redux/actions/loginAction';
import { AppState } from '../../../redux/store';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  loading: boolean;
  getStoreInformationFromStoreId : () => void;
  storeInformation : storeInformation

}

interface itemProp {}

interface State {}

class StoreInfoScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
      limit: 20,
      change: false,
    };

  }
  _bootstrapAsync = async () => {

    
 
  };
  componentDidMount() {
    this.props.getStoreInformationFromStoreId();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Bize Ulaşın',
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

  

  render() {
    return <View style={styles.container}><ScrollView bounces={false} contentContainerStyle={{flex:1}}>
      
      {this.renderContentNew()}</ScrollView></View>;
  }
  renderContentNew() {

        if(this.props.loading || !this.props.storeInformation) {
            return (
                <View style={{flex:1, justifyContent:'center',alignSelf:'center'}}>
                    <Spinner color={colors.IconColor} />
            </View>
            )
        }
        let storeInfo = this.props.storeInformation
        return(

          <View>
            <View style={{borderBottomWidth:0.5,borderBottomColor:colors.borderColor,paddingBottom:30}}>
              <Text style={{marginLeft:30,marginTop:10,fontFamily:fonts.primaryFont,fontSize:18}}>
              Şirket İsmi: {storeInfo.storeName}
            </Text>
            <Text style={{marginLeft:30,marginTop:10,fontFamily:fonts.primaryFont,fontSize:18,color:colors.textColorLighter}}>
              {storeInfo.userNameSurname}
            </Text>
            </View>
  
            <TouchableHighlight onPress={()=> () => Linking.openURL(`tel:${storeInfo.phoneNumber}`)} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/007-phone-call.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>{storeInfo.phoneNumber}</Text>
            
              </View>
              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={ () => Platform.OS === "ios" ? Linking.openURL('http://maps.apple.com/maps?daddr=' + storeInfo.address ): Linking.openURL('http://maps.google.com/maps?daddr=' + storeInfo.address)
           } underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/009-location.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,width:Dimensions.get('window').width - 110,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>{storeInfo.address}   aklsjdk lajsdlk asjdkl ajslkdj aslkdja lksdjalsdjalskjdladmlaksjd lkasjdlka jdlk ajsldjalskd</Text>
            
              </View>


              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>
            
          </View>
        )
      



  }
}

const mapStateToProps = (state: AppState) => ({
  loading: state.profile.loading,
  storeInformation: state.profile.storeInformation
});

function bindToAction(dispatch: any) {
  return {
    getStoreInformationFromStoreId : () => 
    dispatch(getStoreInformationFromStoreId())
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(StoreInfoScreen);
