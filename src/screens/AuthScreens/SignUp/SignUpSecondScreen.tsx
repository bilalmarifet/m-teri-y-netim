import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Label,

  Spinner,
} from 'native-base';

import {
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import { Formik } from 'formik';

import { createBaseUser, BaseUser, createUserControlIfNumberIsUsed } from '../../../redux/actions/signUpActions';
import styles from '../Login/styles';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import Hr from 'react-native-hr-component';
import { UserFirstData } from '../../../redux/reducers/signUpReducers';
import { showMessage } from 'react-native-flash-message';
import { userType } from '../../../redux/actions/profileActions';
import { Input, Button } from '../../../components';
import { BasestoreId, BaseStoreOwnerUserId } from '../../../services/AppConfig';
import * as Yup from 'yup';
import { colors, fonts } from '../../../constants';

import TextInputMask from 'react-native-text-input-mask';
import { SuccessButton } from '../../../components/SuccessButton';
import { District } from '../../../redux/actions/DistrictAction';

// import Icon from 'react-native-vector-icons/Ionicons'
// import { Input } from "react-native-elements";

// const logo = require("./water.png");

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  isSecondFinished: boolean;
  isSecondSucceed: boolean;
  isSecondLoading: boolean;
  loginErrorMessage: string;
  createBaseUser: (user: BaseUser) => void;
  userFirstData: UserFirstData;
  districtList: District[]
  createUserControlIfNumberIsUsed: (user: BaseUser,isLogin: boolean)  => void;
}

interface userData {
  phoneNumber: string;
  companyName: string;
  adress: string;
}

const loginSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required("Lütfen telefon numaranızı giriniz"),
    NameSurname: Yup.string()
    .min(3,"İsim soyisim en az 3 karakter olmalıdır.")
    .required("İsim soyisim girilmesi zorunludur"),
});

interface State {
  userType: number;
  DistrictName : string | undefined;
}

class SignUpSecondScreen extends Component<Props, State> {
  static navigationOptions = (screenProps: NavigationScreenProps) => {
    return {
      headerStyle: {
        // height : screenProps.navigation.getParam('headerHeight'),
        // backgroundColor:'#d67676'
      },
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      userType: this.props.navigation.getParam('userType'),
      DistrictName: ''
    };
    
  }
  componentDidMount(){
    this.getDistrictName()
  }
  getDistrictName(){
 
   let id =  this.props.navigation.getParam('DistrictId')
   console.log(id)
   if(id && this.props.districtList && this.props.districtList.length > 0 ) {
     this.setState({DistrictName: this.props.districtList.find(e=>e.id === id)?.districtName})
   }
  }

  showSimpleMessage() {
    if (this.props.isSecondFinished && !this.props.isSecondSucceed) {
      showMessage({
        message: this.props.loginErrorMessage,
        type: 'danger',
        icon: 'auto',
      });
    }
  }

  handleLogin = (values: userData) => {
    const { isSucceed, navigation } = this.props;
    var user = {} as BaseUser;
    user.nameSurname = values.NameSurname
    user.address = this.state.DistrictName ?? ""
    user.phoneNumber = values.phoneNumber;
    user.userType = 3
    user.storeId = BasestoreId
    user.storeOwnerUserId = BaseStoreOwnerUserId
    console.log(user)
    this.props.createUserControlIfNumberIsUsed(user,false)
  };

  render() {

    return (
      <View>
        <SafeAreaView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
              <Formik
                initialValues={{ phoneNumber: '', NameSurname: '' }}
                validationSchema={loginSchema}
                onSubmit={values => this.handleLogin(values)}>
                {props => {
                  return (
                    <View>
                      <View style={[styles.inputContainer]}>
                        <View>
                          <Text
                            style={{
                              fontFamily: fonts.primaryFont,
                              fontSize: 32,
                            }}>
                            Üye Ol
                          </Text>
                          <Text style={{ fontFamily: fonts.primaryFont, color: '#ccc' }}>hızlıca sipariş vermeye başla</Text>
                        </View>
                        <View style={{ marginTop: '20%' }}>

                        <Input
                      placeholder="İsim soyisim"
                      value={props.values.NameSurname}
                      onChangeText={props.handleChange("NameSurname")}
                      onBlur={props.handleBlur("NameSurname")}

                      error={props.touched.NameSurname && props.errors.NameSurname}
                    />
                    {props.touched.NameSurname && props.errors.NameSurname && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.NameSurname}
                        </Text>
              }
                          <TextInputMask
                            style={{
                              height: 40,
                              borderBottomWidth: 1,
                              borderBottomColor: (props.touched.phoneNumber && props.errors.phoneNumber) ? colors.accent : colors.borderColor,
                              fontSize: 16,
                              marginVertical: 10
                            }}
                            placeholder="Telefon numarası"
                            refInput={ref => { this.input = ref }}
                            onChangeText={(formatted, extracted) => {
                              console.log(formatted) // +1 (123) 456-78-90
                              console.log(extracted) // 1234567890
                              props.setFieldValue("phoneNumber", extracted)
                            }}
                            onBlur={props.handleBlur("phoneNumber")}
                            error={props.touched.phoneNumber && props.errors.phoneNumber}
                            mask={"+90 ([000]) [000] [00] [00]"}
                          />
                          {props.touched.phoneNumber && props.errors.phoneNumber && <Text style={{ fontSize: 12, color: colors.accent }}>
                            {props.errors.phoneNumber}
                          </Text>
                          }

                        </View>
                        <SuccessButton loading={this.props.isSecondLoading} text="Devam et" onPress={props.handleSubmit} />

                      </View>

                    </View>
                  );
                }}
              </Formik>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
        {this.showSimpleMessage()}
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isSecondFinished: state.signUp.isSecondFinished,
  isSecondSucceed: state.signUp.isSecondSucceed,
  isSecondLoading: state.signUp.isSecondLoading,
  loginErrorMessage: state.signUp.loginErrorMessage,
  userFirstData: state.signUp.userFirstData,
  districtList: state.District.DistrictList
});

function bindToAction(dispatch: any) {
  return {
    createBaseUser: (user: BaseUser) => dispatch(createBaseUser(user)),
    createUserControlIfNumberIsUsed: (user: BaseUser,isLogin: boolean) => 
    dispatch(createUserControlIfNumberIsUsed(user,isLogin))
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(SignUpSecondScreen);
