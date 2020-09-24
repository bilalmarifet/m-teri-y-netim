import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  Alert,
  Image
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
  Icon,
  Item,
  Label,
  Input,
  List,
  ListItem,
  Body,
  Right,
  Left,
} from 'native-base';
import {fetchImageData, fetchMoreImageData} from '../../../redux/actions/fetch';
import {TouchableOpacity,TouchableHighlight, ScrollView} from 'react-native-gesture-handler';
import {showMessage} from 'react-native-flash-message';
import {colors, fonts} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';

import * as Yup from 'yup'; // for everything

import {Formik} from 'formik';
import {getUserInfo, UserInfo} from '../../../redux/actions/profileActions';
import {logOut} from '../../../redux/actions/loginAction';
import { AppState } from '../../../redux/store';

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
    return <View style={styles.container}><ScrollView bounces={false} contentContainerStyle={{flex:1}}>
      {this.renderContentNew()}</ScrollView></View>;
  }
  renderContentNew() {
    if(this.props.userInfo) {
      let user = this.props.userInfo
      return(
        <View>
          <View style={{borderBottomWidth:0.5,borderBottomColor:colors.borderColor,paddingBottom:30}}>
          <Image style={{width:150,height:150,justifyContent:'center',borderRadius:75,marginTop:20,alignSelf:'center'}} source={require("../../../assets/bread.jpg")} />
          <Text style={{textAlign:'center',marginTop:10,fontFamily:fonts.primaryFont,fontSize:18}}>
            {user.nameSurname}
          </Text>
          <Text style={{textAlign:'center',marginTop:10,fontFamily:fonts.primaryFont,fontSize:18}}>
            {user.email}
          </Text>
          </View>

          <TouchableHighlight onPress={()=> this.props.navigation.navigate('CustomerEditProfile')} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{flexDirection:'row'}}>
            <Image source={require("../../../images/profile/001-settings.png")} style={{width:34,height:34, borderRadius:17}} />
          <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Profili Düzenle</Text>
          
            </View>
            <View style={{backgroundColor:'#E5F1E5',width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="arrow-forward" style={{color:'#56A6A4',fontSize:12}} /></View>
          </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=> this.props.navigation.navigate('CustomerEditPassword')} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{flexDirection:'row'}}>
            <Image source={require("../../../images/profile/002-man.png")} style={{width:34,height:34, borderRadius:17}} />
          <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Şifre Değiştir</Text>
          
            </View>
            <View style={{backgroundColor:'#E5F1E5',width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="arrow-forward" style={{color:'#56A6A4',fontSize:12}} /></View>
          </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=> console.log()} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{flexDirection:'row'}}>
            <Image source={require("../../../images/profile/005-term-loan.png")} style={{width:34,height:34, borderRadius:17}} />
          <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Gizlilik Sözleşmesi</Text>
          
            </View>
            <View style={{backgroundColor:'#E5F1E5',width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="arrow-forward" style={{color:'#56A6A4',fontSize:12}} /></View>
          </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=> this.props.logOut()} underlayColor="#AAA"  style={{borderBottomWidth:1,borderBottomColor:colors.borderColor,padding:20,paddingVertical:15,backgroundColor:'white'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{flexDirection:'row'}}>
            <Image source={require("../../../images/profile/006-log-out.png")} style={{width:34,height:34, borderRadius:17}} />
          <Text style={{alignSelf:'center',marginLeft:10,fontWeight:'600',fontFamily:fonts.primaryFont,fontSize:16}}>Çıkış yap</Text>
          
            </View>
            <View style={{backgroundColor:'#E5F1E5',width:24,height:24,borderRadius:12,justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Icon name="arrow-forward" style={{color:'#56A6A4',fontSize:12}} /></View>
          </View>
          </TouchableHighlight>
        </View>
      )
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
