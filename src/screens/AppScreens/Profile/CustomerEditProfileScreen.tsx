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
import {Header, Input} from '../../../components';
import styles from '../styles';
import {AvatarItem} from '../../../components';
import {logoutUserService} from '../../../redux/services/user';
import {
  Thumbnail,
  Icon,
  Item,
  Label,
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
import TextInputMask from 'react-native-text-input-mask';
import { ButtonGradient } from '../../../components/ButtonGradient';
import { AppState } from '../../../redux/store';
import { customerEdit } from '../../../redux/actions/customerEditAction';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  logOut: (navigation?: NavigationScreenProp<NavigationState>) => void;
  getUserInfo: () => void;
  userInfo: UserInfo;
  customerEdit: (user:UserInfo) => void;
  loading: boolean;
}

interface itemProp {}

interface State {}

const changeProfileSchema = Yup.object().shape({
    email: Yup.string()
      .email("Lütfen email formatında giriniz.")
      .min(4,"Email minimum 4 karakter olmalıdır.")
      .required("Email girilmesi zorunludur."),
      NameSurname: Yup.string()
      .min(3,"İsim soyisim minumum 3 karakter olmalıdır.")
      .required("İsim soyisim girilmesi zorunludur."),
      phoneNumber: Yup.string()
  .required("Lütfen telefon numaranızı giriniz").min(10,"Lütfen telefon numaranızı doğru giriniz."),
  address: Yup.string()
    .max(250,"Adres maksimum 250 karakter olabilir")
    .required("Lütfen adres giriniz."),
  });
  

class CustomerEditProfileScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Profil Düzenle',

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
    return <View style={styles.container}><ScrollView bounces={false} contentContainerStyle={{flexGrow:1}}>
      {this.renderContentNew()}</ScrollView></View>;
  }

    handleChangeProfile(values) {
      console.log(this.props.userInfo)
      var user: UserInfo  = {
        nameSurname:  values.NameSurname,
        email: values.email,
        userType: 3,
        address: values.address,
        phoneNumber: values.phoneNumber,
        carboyCount: this.props.userInfo.carboyCount,
        companyName: this.props.userInfo.companyName,
        dayOfWeeks: this.props.userInfo.dayOfWeeks,
        description: this.props.userInfo.description,
        fountainCount:this.props.userInfo.fountainCount,
      }
      this.props.customerEdit(user)
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
              <Formik
                initialValues={{
                  NameSurname: this.props.userInfo.nameSurname ?? "",
                  email: this.props.userInfo.email ?? "",
                  phoneNumber: this.props.userInfo.phoneNumber ?? "",
                  address: this.props.userInfo.address ?? ""
                }}
                validationSchema={changeProfileSchema}
                onSubmit={values => this.handleChangeProfile(values)}>
                {props => {
                  return (
                    <View style={{padding:20}}>
                      <View >
                        
                        <View>
                        <Text style={{color:colors.textColor,fontSize:16,fontWeight:'600'}}>İsim soyisim</Text> 
                        <Input
                      placeholder="İsim soyisim"
                      style={{color:colors.textColor,paddingLeft:20}}
                      value={props.values.NameSurname}
                      onChangeText={props.handleChange("NameSurname")}
                      onBlur={props.handleBlur("NameSurname")}
                      error={props.touched.NameSurname && props.errors.NameSurname}
                    />
                    {props.touched.NameSurname && props.errors.NameSurname && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.NameSurname}
                        </Text>
              }
                        </View>
                       
                        <View style={{marginTop:10}}>
                        <Text style={{color:colors.textColor,fontSize:16,fontWeight:'600'}}>Telefon no</Text> 

                        <TextInputMask
                    style={{height: 40,
                      borderBottomWidth: 1,
                      borderBottomColor: (props.touched.phoneNumber && props.errors.phoneNumber) ? colors.accent : colors.borderColor,
                      fontSize: 16,
                      marginVertical: 10,
                    paddingLeft:20}}
                    placeholder="Telefon numarası"
    value={this.props.userInfo.phoneNumber ? this.props.userInfo.phoneNumber : ""}
  refInput={ref => { this.input = ref }}
  onChangeText={(formatted, extracted) => {
    console.log(formatted) // +1 (123) 456-78-90
    console.log(extracted) // 1234567890
    props.setFieldValue("phoneNumber",extracted)
  }}
  onBlur={props.handleBlur("phoneNumber")}
  error={props.touched.phoneNumber && props.errors.phoneNumber}
  mask={"+90 ([000]) [000] [00] [00]"}
/>
                     {props.touched.phoneNumber && props.errors.phoneNumber && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.phoneNumber}
                        </Text>
              }
              
                        </View>
                        <View style={{marginTop:10}}>
                        <Text style={{color:colors.textColor,fontSize:16,fontWeight:'600'}}>Email</Text> 
                        <Input
                      placeholder="Email"
                      style={{color:colors.textColor,paddingLeft:20}}
                      value={props.values.email}
                      onChangeText={props.handleChange("email")}
                      onBlur={props.handleBlur("email")}
                      error={props.touched.email && props.errors.email}
                    />
                    {props.touched.email && props.errors.email && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.email}
                        </Text>
              }
                        </View>
                       
                        <View style={{marginTop:10}}>
                        <Text style={{color:colors.textColor,fontSize:16,fontWeight:'600'}}>Adres</Text> 
                        <Input
                      placeholder="Adres"
                      style={{color:colors.textColor,paddingLeft:20}}
                      value={props.values.address}
                      onChangeText={props.handleChange("address")}
                      onBlur={props.handleBlur("address")}
                      error={props.touched.address && props.errors.address}
                    />
                    {props.touched.address && props.errors.address && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.address}
                        </Text>
              }
                        </View>
                       
                        <View>
                       
                        </View>
                    </View>
                    <ButtonGradient style={{marginTop:20}} text="Değişiklikleri kaydet" loading={this.props.loading} onPress={props.handleSubmit} />
                    </View>
                  );
                }}
              </Formik>
          
          


        </View>
      )
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  loading: state.customerEdit.loadingCustomerEdit,
  userInfo: state.profile.userInfo,
});

function bindToAction(dispatch: any) {
  return {
    customerEdit: (user: UserInfo) => 
    dispatch(customerEdit(user))
    

  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(CustomerEditProfileScreen);
