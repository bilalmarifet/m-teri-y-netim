import React, {Component} from 'react';
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
import {Formik} from 'formik';
import * as Yup from 'yup';
// import { loginUserService } from "../../../redux/actions/loginAction";
import styles from '../Login/styles';
import {connect} from 'react-redux';
import {AppState} from '../../../redux/store';
import {controlEmail} from '../../../redux/actions/signUpActions';
import {showMessage} from 'react-native-flash-message';
import { colors, fonts } from '../../../constants';
import { Input, Button } from '../../../components';
import { ButtonSecond } from '../../../components/ButtonSecond';
import { SuccessButton } from '../../../components/SuccessButton';

// import Icon from 'react-native-vector-icons/Ionicons'
// import { Input } from "react-native-elements";

// const logo = require("./water.png");

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  isFinished: boolean;
  isSucceed: boolean;
  isLoading: boolean;
  loginErrorMessage: string;
  controlEmail: (NameSurname: string, password: string, email: string) => void;
}

interface userDataFirst {
  NameSurname: string;
  email: string;
  password: string;
}

const loginSchema = Yup.object().shape({
  NameSurname: Yup.string()
    .min(3,"İsim soyisim en az 3 karakter olmalıdır.")
    .required("İsim soyisim girilmesi zorunludur"),
  // email: Yup.string()
  //   .email("Lütfen geçerli bir email adresi giriniz")
  //   .min(4,"Email en az 4 karakter içermelidir.")
  //   .required("Email girilmesi zorunludur."),
  password: Yup.string()
    .min(6,"Şifre en az 6 karakter olmalıdır.")
    .required("Şifre girilmesi zorunludur."),
});

interface State {
  userType: number;
  DistrictId: number;
}
class SignUpFirstScreen extends Component<Props, State> {
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
      DistrictId : this.props.navigation.getParam('DistrictId')
    };
  }

 

  handleLogin = (values: userDataFirst) => {
    const {isSucceed} = this.props;
    this.props.controlEmail(values.NameSurname, values.password, values.email);
  };

  render() {
    if (this.props.isSucceed) {
      this.props.navigation.navigate('SignUpSecond', {
        userType: this.state.userType,
        DistrictId: this.state.DistrictId
      });
    }
    return (
      <View>
        <SafeAreaView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView bounces={false} contentContainerStyle={{flexGrow: 1}}>
              <Formik
                initialValues={{
                  NameSurname: '',
                  email: '',
                  password: '',
                }}
                validationSchema={loginSchema}
                onSubmit={values => this.handleLogin(values)}>
                {props => {
                  return (
                    <View style={{justifyContent: 'center'}}>
                      <View style={[styles.inputContainer]}>
                        <View
                          style={{
                          }}>
                          <Text
                            style={{
                              fontFamily:fonts.primaryFont,
                              fontSize: 32,
                            }}>
                            Üye Ol
                          </Text>
                          <Text style={{fontFamily:fonts.primaryFont, color:'#ccc'}}>hızlıca sipariş vermeye başla</Text>
                        </View>
                        <View style={{marginTop: '20%'}}>
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
                           {/* <Input
                        placeholder="Email"
                        value={props.values.email}
                        onChangeText={props.handleChange("email")}
                        onBlur={props.handleBlur("email")}

                        error={props.touched.email && props.errors.email}
                      />
                      {props.touched.email && props.errors.email && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.email}
                        </Text>
              } */}
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
                       
                        </View>
                        
                        <SuccessButton loading={this.props.isLoading} text="Devam et" onPress={props.handleSubmit} />
                      </View>
                  
                  
                    </View>
                  );
                }}
              </Formik>
           
           
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
        </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isFinished: state.signUp.isFinished,
  isSucceed: state.signUp.isSucceed,
  isLoading: state.signUp.isLoading,
  loginErrorMessage: state.signUp.loginErrorMessage,
});

function bindToAction(dispatch: any) {
  return {
    controlEmail: (NameSurname: string, password: string, email: string) =>
      dispatch(controlEmail(NameSurname, password, email)),
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(SignUpFirstScreen);
