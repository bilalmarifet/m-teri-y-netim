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

import { createBaseUser, BaseUser, changePasswordFromForgot } from '../../../redux/actions/loginAction';
import styles from './styles';
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
    loading:boolean;
    changePasswordFromForgot : (newPassword: string,code : string,email:string) => void;
}

interface userData {
    newPassword: string;
    newPasswordAgain : string;
}

const loginSchema = Yup.object().shape({
    newPassword: Yup.string()
        .min(6, "Şifre minimum 6 karakter olmalıdır.")
        .required("Şifre girilmesi zorunludur."),
    newPasswordAgain: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Şifreniz eşleşmemektedir.')
});


interface State {
    code: string;
    email: string;
}
class UpdateForgotPassowordScreen extends Component<Props, State> {
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
            code : this.props.navigation.getParam('code'),
            email: this.props.navigation.getParam('email')
        }
    }


    handleRechangePassword = (values: userData) => {
        this.props.changePasswordFromForgot(values.newPassword,this.state.code,this.state.email)
    };

    render() {

        return (
            <View>
                <SafeAreaView>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
                            <Formik
                                initialValues={{ newPassword: '', newPasswordAgain: '' }}
                                validationSchema={loginSchema}
                                onSubmit={values => this.handleRechangePassword(values)}>
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
                                                        Şifre Yenileme
                          </Text>
                                                    <Text style={{ fontFamily: fonts.primaryFont, color: '#ccc' }}>Yeni şifrenizi giriniz</Text>
                                                </View>
                                                <View style={{ marginTop: '20%' }}>
                                                    <Input
                                                        secureTextEntry
                                                        placeholder="Yeni şifreniz"
                                                        value={props.values.newPassword}
                                                        onChangeText={props.handleChange("newPassword")}
                                                        onBlur={props.handleBlur("newPassword")}
                                                        error={props.touched.newPassword && props.errors.newPassword}
                                                    />
                                                    {props.touched.newPassword && props.errors.newPassword && <Text style={{ fontSize: 12, color: colors.accent }}>
                                                        {props.errors.newPassword}
                                                    </Text>
                                                    }

                                                    <Input
                                                    secureTextEntry
                                                        placeholder="Yeni şifreniz tekrar"
                                                        value={props.values.newPasswordAgain}
                                                        onChangeText={props.handleChange("newPasswordAgain")}
                                                        onBlur={props.handleBlur("newPasswordAgain")}
                                                        error={props.touched.newPasswordAgain && props.errors.newPasswordAgain}
                                                    />
                                                    {props.touched.newPasswordAgain && props.errors.newPasswordAgain && <Text style={{ fontSize: 12, color: colors.accent }}>
                                                        {props.errors.newPasswordAgain}
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
    loading: state.login.isLoadingForgotPasswordChange

});

function bindToAction(dispatch: any) {
    return {
        changePasswordFromForgot : (newPassword: string,code : string,email:string) => 
        dispatch(changePasswordFromForgot(newPassword,code,email))
    };
}

export default connect(
    mapStateToProps,
    bindToAction,
)(UpdateForgotPassowordScreen);
