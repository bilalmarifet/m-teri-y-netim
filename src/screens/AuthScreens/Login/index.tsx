import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform, Image, Dimensions
} from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { Formik } from "formik";
import * as Yup from "yup";

import { loginUserService } from "../../../redux/actions/loginAction";
import { Input, Button } from "../../../components";
import styles from "./styles";
import { connect } from "react-redux";
import { AppState } from "../../../redux/store";
import { colors, fonts } from "../../../constants";
import { SuccessButton } from "../../../components/SuccessButton";

import { TouchableHighlight, TouchableOpacity } from "react-native";
import NavigationService from "../../../services/NavigationService";
import Icon from 'react-native-vector-icons/Feather';
import { BaseImage, BasestoreId, BaseStoreOwnerUserId } from "../../../services/AppConfig";
import { District, getDistrict } from "../../../redux/actions/DistrictAction";
import { BaseUser, createUserControlIfNumberIsUsed } from "../../../redux/actions/signUpActions";
import TextInputMask from 'react-native-text-input-mask';
import { showSimpleMessage } from "../../../components/showMessage";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  loginUserService: (username: string, password: string) => void;
  isLoading: boolean;
  getDistrict :() => void;
  isLoadingDistrict : boolean;
  districtList: District[];
}
interface userData {
  username: string;
  password: string;
  
}

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .email("Lütfen email formatında giriniz.")
    .min(4,"Email minimum 4 karakter olmalıdır.")
    .required("Email girilmesi zorunludur."),
  password: Yup.string()
    .min(6,"Şifre minimum 6 karakter olmalıdır.")
    .required("Şifre girilmesi zorunludur.")
});


class Login extends Component<Props, {}> {
  handleLogin = (values: userData) => {
    const { navigation } = this.props;
    this.props.loginUserService(values.username, values.password)
  };
  componentDidMount() {
      this.props.getDistrict()
  }

  static navigationOptions = ({}) => {
    header: null
   };
   gotoDistrictOrNot() {
     if(this.props.districtList && this.props.districtList.length > 0) {
      this.props.navigation.navigate("DistrictSelection")
     }
     else {
      this.props.navigation.navigate("SignUp")
     }
   }
  render() {
    return (
      <View style={[styles.container,{paddingTop:0}]}>
        <TouchableOpacity style={{position:'absolute', left:10, top:50,zIndex:10}}  onPress={()=>this.props.navigation.navigate("Products")}>

        <Icon style={{fontSize:24}} name="x" ></Icon>  

        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
   
          <ScrollView bounces={false}>
            <Formik
              initialValues={{ username: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={values => this.handleLogin(values)}
            >
              {props => {

                return (
                  <View>
                    <View style={[styles.headStyle,{marginTop:Dimensions.get('window').height / 10}]}>
                      {/* <Image source={BaseImage} style={{width:100,height:100,marginBottom:10}} /> */}
                      <Text style={[styles.headText]}>
                    Su 24
                      </Text>
                    </View>
                    <View style={[styles.inputContainer,{paddingBottom:0}]}>
                      <Input
                        placeholder="Email"
                        value={props.values.username}
                        onChangeText={props.handleChange("username")}
                        onBlur={props.handleBlur("username")}
                        error={props.touched.username && props.errors.username}
                      />
                      {props.touched.username && props.errors.username && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.username}
                      </Text>
                      }
                      <Input
                        placeholder="Şifre"
                        value={props.values.password}
                        onChangeText={props.handleChange("password")}
                        onBlur={props.handleBlur("password")}
                        secureTextEntry
                        error={props.touched.password && props.errors.password}
                      />
                      {props.touched.password && props.errors.password && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.password}
                        </Text>
              }
                      <TouchableOpacity onPress={()=> this.props.navigation.navigate('ForgotPassword')}><Text style={{fontFamily:fonts.primaryFont,textAlign:'right',marginRight:5}}>Şifremi unuttum</Text></TouchableOpacity>
                
                      <SuccessButton loading={this.props.isLoading} text="Giriş yap" onPress={props.handleSubmit} />
                      <Button text="Üye ol" loading={this.props.isLoadingDistrict} style={{backgroundColor:colors.IconColor,paddingHorizontal: 10,  flexDirection:'row', justifyContent:'space-between'}} textStyle={{color:'white'}} onPress={()=> this.gotoDistrictOrNot()} />
                      <View
                            style={{
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              justifyContent: 'center',
                              paddingBottom:20
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Avenir Next',
                                fontSize: 16,
                                color:colors.textColorLighter
                              }}>
                              Üye olarak veya Giriş Yaparak{' '}
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate('UserAgreement')
                              }>
                              <Text
                                style={{
                                  fontFamily: 'Avenir Next',
                                  fontSize: 16,

                                }}>
                                Gizlilik Sözleşmesini{' '}
                              </Text>
                            </TouchableOpacity>
                            <Text
                              style={{
                                fontFamily: 'Avenir Next',
                                fontSize: 16,
                                color:colors.textColorLighter
                              }}>
                              Kabul Etmiş Sayılırsınız.
                            </Text>
                          </View>
                       
                       
                     </View>
                  </View>
                );
              }}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}



const mapStateToProps = (state: AppState) => ({
  isFinished: state.login.isFinished,
  isSucceed: state.login.isSucceed,
  isLoading: state.login.isLoading,
  loginErrorMessage: state.login.loginErrorMessage,
  isLoadingDistrict : state.District.loading,
  districtList: state.District.DistrictList
});

function bindToAction(dispatch: any) {
  return {
    loginUserService: (username: string, password: string) =>
      dispatch(loginUserService(username, password)),
      getDistrict :() =>
      dispatch(getDistrict())
  };
}



export default connect(
  mapStateToProps,
  bindToAction,
)(Login);
