import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { Formik } from "formik";
import * as Yup from "yup";
// import Icon from "react-native-vector-icons/SimpleLineIcons";
import { loginUserService } from "../../../redux/actions/loginAction";
import { Input, Button } from "../../../components";
import styles from "./styles";
import { connect } from "react-redux";
import { AppState } from "../../../redux/store";
import { colors } from "../../../constants";
import { SuccessButton } from "../../../components/SuccessButton";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  loginUserService: (username: string, password: string) => void;
  isLoading: boolean;
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

  render() {
    return (
      <View style={styles.container}>
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
                    <View style={styles.headStyle}>
                      {/* <Icon name="emotsmile" size={100} /> */}
                      <Text style={styles.headText}>
                     Giriş Yap
                      </Text>
                    </View>
                    <View style={styles.inputContainer}>
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
                      <SuccessButton loading={this.props.isLoading} text="Giriş yap" onPress={props.handleSubmit} />
                      <Button text="Üye ol" style={{backgroundColor:'#fff'}} onPress={()=> this.props.navigation.navigate("SignUp")} />
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
});

function bindToAction(dispatch: any) {
  return {
    loginUserService: (username: string, password: string) =>
      dispatch(loginUserService(username, password)),
  };
}



export default connect(
  mapStateToProps,
  bindToAction,
)(Login);
