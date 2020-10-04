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

import { createBaseUser, BaseUser, forgotPassword } from '../../../redux/actions/loginAction';
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
import { showSimpleMessage } from '../../../components/showMessage';

// import Icon from 'react-native-vector-icons/Ionicons'
// import { Input } from "react-native-elements";

// const logo = require("./water.png");

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  loading: boolean;
  forgotPassword: (email:string) => void;
}

interface userData {
    code: string;
}
interface State {
    code : string;
    email: string;
}

const loginSchema = Yup.object().shape({
    code: Yup.string()
    .min(6,"Kod 6 karakter olmalıdır.")
    .required("Email girilmesi zorunludur."),
});



class ForgotPasswordScreen extends Component<Props,State > {
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
        email : this.props.navigation.getParam('email'),
        code : this.props.navigation.getParam('code')
    }
  }
  

  handleForgotPassword = (values: userData) => {
    console.log(this.state.code)
    if(this.state.code === values.code) {
        this.props.navigation.navigate('UpdateForgotPassoword',{code: values.code,email:this.state.email})
    } else {
        showSimpleMessage("Mailinize gelen kod ile girdiğiniz kod uyuşmamaktadır.","danger")
    }
  };

  render() {

    return (
      <View>
        <SafeAreaView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
              <Formik
                initialValues={{ code: '' }}
                validationSchema={loginSchema}
                onSubmit={values => this.handleForgotPassword(values)}>
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
                            Mailinize kod geldi
                          </Text>
                          <Text style={{ fontFamily: fonts.primaryFont, color: '#ccc' }}>Mailinize gelen kodu girin</Text>
                        </View>
                        <View style={{ marginTop: '20%' }}>
                          <Input
                            maxLength={6}
                            placeholder="Mailinize gelen kod"
                            value={props.values.code}
                            onChangeText={props.handleChange("code")}
                            onBlur={props.handleBlur("code")}
                            error={props.touched.code && props.errors.code}
                          />
                          {props.touched.code && props.errors.code && <Text style={{ fontSize: 12, color: colors.accent }}>
                            {props.errors.code}
                          </Text>
                          }


                        </View>
                        <SuccessButton loading={this.props.loading} text="Devam et" onPress={props.handleSubmit} />

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
    loading: state.login.isLoadingForgotPassword
});

function bindToAction(dispatch: any) {
  return {
    forgotPassword: (email:string) =>
    dispatch(forgotPassword(email))
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(ForgotPasswordScreen);
