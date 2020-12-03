import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  Alert,
  Image, AsyncStorage
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
  Left,
} from 'native-base';
import {TouchableOpacity,TouchableHighlight, ScrollView} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {colors, fonts} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';

import * as Yup from 'yup'; // for everything

import {Formik} from 'formik';
import {getUserInfo, UserInfo} from '../../../redux/actions/profileActions';
import {logOut} from '../../../redux/actions/loginAction';
import { AppState } from '../../../redux/store';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  logOut: (navigation?: NavigationScreenProp<NavigationState>) => void;
  getUserInfo: () => void;
  userInfo: UserInfo;
}

interface itemProp {}

interface State {}

class CustomerProfileScreen extends Component<Props, State> {
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
    this.props.getUserInfo();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Profilim',
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
    return <View style={styles.container}><ScrollView   contentContainerStyle={{paddingBottom:30}}>
      
      {this.renderContentNew()}</ScrollView></View>;
  }
  renderContentNew() {
    const userToken = global.TOKEN;
    console.log("profile", userToken);
    if(userToken){
      if(this.props.userInfo) {
        let user = this.props.userInfo
        return(
          <View>
            <View style={{borderBottomWidth:0.5,borderBottomColor:colors.borderColor,paddingBottom:30}}>
              <Text style={{marginLeft:30,marginTop:10,fontFamily:fonts.primaryFont,fontSize:18}}>
              {user.nameSurname}
            </Text>
            <Text style={{marginLeft:30,marginTop:10,fontFamily:fonts.primaryFont,fontSize:18,color:colors.textColorLighter}}>
              {user.email}
            </Text>
            </View>
  
            <TouchableHighlight onPress={()=> this.props.navigation.navigate('CustomerEditProfile')} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/001-settings.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Profili Düzenle</Text>
            
              </View>
              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=> this.props.navigation.navigate('CustomerEditPassword')} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/002-man.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Şifre Değiştir</Text>
            
              </View>
              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={()=> this.props.navigation.navigate('MyAdresses')} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/009-location.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Adreslerim</Text>
            
              </View>
              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={()=> this.props.navigation.navigate('UserAgreement')} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/005-term-loan.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Gizlilik Sözleşmesi</Text>
            
              </View>
              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=> this.props.navigation.navigate('StoreInfo')} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/007-contact-book.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Bize Ulaşın</Text>
            
              </View>
              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=> this.props.logOut()} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/006-log-out.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Çıkış yap</Text>
            
              </View>
              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>
          </View>
        )
      }
    }
    else{
      return (
      <View>
        <Text style={{padding:20,fontSize:18,  fontFamily:fonts.primaryFont}}>Henüz giriş yapmadınız sipariş vermeniz ve profil bilgilerini görmek için lütfen giriş yapınız veya üye olunuz.</Text>
        <TouchableHighlight onPress={()=> this.props.navigation.navigate('Login')} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/login.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Giriş Yap</Text>
            
              </View>
              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=> this.props.navigation.navigate('StoreInfo')} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/007-contact-book.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Bize Ulaşın</Text>
            
              </View>
              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=> this.props.navigation.navigate('UserAgreement')} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/005-term-loan.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Gizlilik Sözleşmesi</Text>
            
              </View>
              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={()=> this.props.navigation.navigate('Login')} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
              <Image source={require("../../../images/profile/register.png")} style={{width:34,height:34, borderRadius:17}} />
            <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Üye Ol</Text>
            
              </View>
              <View style={{backgroundColor:colors.viewBackground,width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="chevron-forward" style={{color:colors.viewBackgroundText,fontSize:12}} /></View>
            </View>
            </TouchableHighlight>
      </View>
      );

    }

  }
}

const mapStateToProps = (state: AppState) => ({
  loading: state.profile.loading,
  userInfo: state.profile.userInfo,
  message: state.profile.message,
});

function bindToAction(dispatch: any) {
  return {
    getUserInfo: () => dispatch(getUserInfo()),
    logOut: (navigation?: NavigationScreenProp<NavigationState>) =>
      dispatch(logOut(navigation)),
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(CustomerProfileScreen);
