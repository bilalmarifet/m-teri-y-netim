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
  Icon,
  Spinner,
} from 'native-base';

import {
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {createBaseUser, BaseUser} from '../../../redux/actions/signUpActions';
import styles from '../Login/styles';
import {connect} from 'react-redux';
import {AppState} from '../../../redux/store';
import Hr from 'react-native-hr-component';
import {UserFirstData} from '../../../redux/reducers/signUpReducers';
import {showMessage} from 'react-native-flash-message';
import {userType} from '../../../redux/actions/profileActions';
import { Input, Button } from '../../../components';
import { BasestoreId, BaseStoreOwnerUserId } from '../../../services/AppConfig';

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
}

interface userData {
  phoneNumber: string;
  companyName: string;
  adress: string;
}

const loginSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .min(9)

    .required(),
  companyName: Yup.string().max(50),
  adress: Yup.string()
    .max(100)
    .required(),
});

interface State {
  userType: number;
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
    };
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
    const {isSucceed, navigation} = this.props;
    var user = {} as BaseUser;
    user.nameSurname = this.props.userFirstData.NameSurname;
    user.email = this.props.userFirstData.email;
    user.password = this.props.userFirstData.password;
    user.address = values.adress;
    user.companyName = "";
    user.phoneNumber = values.phoneNumber;
    user.userType = 3
    user.storeId = BasestoreId
    user.storeOwnerUserId = BaseStoreOwnerUserId
      this.props.createBaseUser(user);
  };

  render() {

    console.log(this.state.userType);
    return (
      <View>
        <SafeAreaView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView bounces={false} contentContainerStyle={{flexGrow: 1}}>
              <Formik
                initialValues={{phoneNumber: '', companyName: '', adress: ''}}
                validationSchema={loginSchema}
                onSubmit={values => this.handleLogin(values)}>
                {props => {
                  return (
                    <View>
                      <View style={[styles.inputContainer]}>
                        <View
                          style={{
                            alignSelf: 'center',
                            borderBottomWidth: 1,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Avenir Next',
                              fontSize: 32,
                            }}>
                            Üye Ol
                          </Text>
                        </View>
                        <View style={{marginTop: '20%'}}>
                        <Input
                      placeholder="Telefon numarası"
                      value={props.values.phoneNumber}
                      onChangeText={props.handleChange("phoneNumber")}
                      onBlur={props.handleBlur("phoneNumber")}
                      error={props.touched.phoneNumber && props.errors.phoneNumber}
                    />
                     {props.touched.phoneNumber && props.errors.phoneNumber && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.phoneNumber}
                        </Text>
              }

<Input
                      placeholder="Adres"
                      value={props.values.adress}
                      onChangeText={props.handleChange("adress")}
                      onBlur={props.handleBlur("adress")}
                      error={props.touched.adress && props.errors.adress}
                    />
                     {props.touched.adress && props.errors.adress && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.adress}
                        </Text>
              }

                        
                        </View>
                        <Button loading={this.props.isSecondLoading} text="Devam et" onPress={props.handleSubmit} />
                   
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
