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

// import Icon from 'react-native-vector-icons/Ionicons'
// import { Input } from "react-native-elements";

// const logo = require("./water.png");

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  loading: boolean;
  forgotPassword: (email:string) => void;
}

interface userData {
    email: string;
}

const loginSchema = Yup.object().shape({
    email: Yup.string()
    .email("Lütfen email formatında giriniz.")
    .min(4,"Email minimum 4 karakter olmalıdır.")
    .required("Email girilmesi zorunludur."),
});



class ForgotPasswordScreen extends Component<Props, {}> {
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
    
  }
  

  handleForgotPassword = (values: userData) => {
    this.props.forgotPassword(values.email)
  };

  render() {

    return (
      <View>
        <SafeAreaView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
              <Formik
                initialValues={{ email: '' }}
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
                            Şifremi Unuttum
                          </Text>
                          <Text style={{ fontFamily: fonts.primaryFont, color: '#ccc' }}>Şifrenizi değiştirmek için email adresinizi giriniz</Text>
                        </View>
                        <View style={{ marginTop: '20%' }}>
                          <Input
                            placeholder="Email"
                            value={props.values.email}
                            onChangeText={props.handleChange("email")}
                            onBlur={props.handleBlur("email")}
                            error={props.touched.email && props.errors.email}
                          />
                          {props.touched.email && props.errors.email && <Text style={{ fontSize: 12, color: colors.accent }}>
                            {props.errors.email}
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
