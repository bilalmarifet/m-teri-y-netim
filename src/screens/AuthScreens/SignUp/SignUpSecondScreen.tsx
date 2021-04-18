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

import { createBaseUser, BaseUser } from '../../../redux/actions/signUpActions';
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
}

interface userData {
  phoneNumber: string;
  companyName: string;
  adress: string;
}

const loginSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required("Lütfen telefon numaranızı giriniz"),
  companyName: Yup.string().max(50),
  adress: Yup.string()
    .max(250, "Adres maksimum 250 karakter olabilir")
    .required("Lütfen adres giriniz."),
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
    user.nameSurname = this.props.userFirstData.NameSurname;
    user.email = this.props.userFirstData.email ?? '';
    user.password = this.props.userFirstData.password;
    user.address = values.adress;
    user.companyName = "";
    user.phoneNumber = "0" + values.phoneNumber;
    user.userType = 3
    user.storeId = BasestoreId
    user.storeOwnerUserId = BaseStoreOwnerUserId
    console.log(user)
    if(this.state.DistrictName && this.state.DistrictName.length > 0) {
      user.address = this.state.DistrictName + " " + user.address
    }

    console.log(user)
    this.props.createBaseUser(user);
  };

  render() {

    return (
      <View>
        <SafeAreaView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
              <Formik
                initialValues={{ phoneNumber: '', companyName: '', adress: '' }}
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

                         <View>
                        {this.state.DistrictName ? <Text style={{fontFamily:fonts.primaryFont,fontSize:15,marginTop:10}}>{this.state.DistrictName}<Text style={{color:colors.textColorLighter,}}> (seçtiğiniz mahalleyi adrese eklemenize gerek yoktur.)</Text></Text> : null}
                         </View>
                          <Input
                            placeholder="Adres"
                            value={props.values.adress}
                            onChangeText={props.handleChange("adress")}
                            onBlur={props.handleBlur("adress")}
                            error={props.touched.adress && props.errors.adress}
                          />
                          {props.touched.adress && props.errors.adress && <Text style={{ fontSize: 12, color: colors.accent }}>
                            {props.errors.adress}
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
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(SignUpSecondScreen);
