import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  Alert,
  Image,
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
import { customerUpdatePassword } from '../../../redux/actions/customerEditAction';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  logOut: (navigation?: NavigationScreenProp<NavigationState>) => void;
  getUserInfo: () => void;
  userInfo: UserInfo;
  customerUpdatePassword:(oldPassword:string,newPassword:string) => void;
  loading:boolean;
}

interface itemProp {}

interface State {}

const changeProfileSchema = Yup.object().shape({
    oldPassword: Yup.string()
    .min(6,"Şifre en az 6 karakter olmalıdır.")
    .required("Şifre girilmesi zorunludur."),
    newPassword: Yup.string()
    .min(6,"Şifre en az 6 karakter olmalıdır.")
    .required("Şifre girilmesi zorunludur.")
    .notOneOf([Yup.ref('oldPassword'), null], 'Yeni şifreniz eski şifrenizden farklı olmalıdır.'),
    newPasswordAgain:  Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Yeni şifreniz eşleşmelidir.')
   
  });
  

class CustomerEditPasswordScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Şifre Değiştir',

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
    return <View style={styles.container}><ScrollView bounces={false} contentContainerStyle={{flex:1}}>
      {this.renderContentNew()}</ScrollView></View>;
  }

    handleChangeProfile(values) {
      this.props.customerUpdatePassword(values.oldPassword,values.newPassword)
    }

  renderContentNew() {

      return(
        <View>
              <Formik
                initialValues={{
                  oldPassword: '',
                  newPassword: '',
                  newPasswordAgain: ''
                }}
                validationSchema={changeProfileSchema}
                onSubmit={values => this.handleChangeProfile(values)}>
                {props => {
                  return (
                    <View style={{padding:20}}>
                      <View >
                        
                        <View>
                        <Text style={{color:colors.textColor,fontSize:16,fontWeight:'600'}}>Eski Şifreniz</Text> 
                        <Input
                        secureTextEntry
                      placeholder="Eski Şifreniz"
                      style={{color:colors.textColor,paddingLeft:20}}
                      value={props.values.oldPassword}
                      onChangeText={props.handleChange("oldPassword")}
                      onBlur={props.handleBlur("oldPassword")}
                      error={props.touched.oldPassword && props.errors.oldPassword}
                    />
                    {props.touched.oldPassword && props.errors.oldPassword && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.oldPassword}
                        </Text>
              }
                        </View>
                        <View style={{marginTop:10}}>
                        <Text style={{color:colors.textColor,fontSize:16,fontWeight:'600'}}>Yeni şifreniz</Text> 
                        <Input
                        secureTextEntry
                      placeholder="Yeni şifreniz"
                      style={{color:colors.textColor,paddingLeft:20}}
                      value={props.values.newPassword}
                      onChangeText={props.handleChange("newPassword")}
                      onBlur={props.handleBlur("newPassword")}
                      error={props.touched.newPassword && props.errors.newPassword}
                    />
                    {props.touched.newPassword && props.errors.newPassword && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.newPassword}
                        </Text>
              }
                        </View>

                        <View style={{marginTop:10}}>
                        <Text style={{color:colors.textColor,fontSize:16,fontWeight:'600'}}>Yeni Şifreniz tekrar</Text> 
                        <Input
                        secureTextEntry
                      placeholder="Yeni Şifreniz tekrar"
                      style={{color:colors.textColor,paddingLeft:20}}
                      value={props.values.newPasswordAgain}
                      onChangeText={props.handleChange("newPasswordAgain")}
                      onBlur={props.handleBlur("newPasswordAgain")}
                      error={props.touched.newPasswordAgain && props.errors.newPasswordAgain}
                    />
                    {props.touched.newPasswordAgain && props.errors.newPasswordAgain && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.newPasswordAgain}
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

const mapStateToProps = (state: AppState) => ({
  loading: state.customerEdit.loadingCustomerUpdatePassword,
});

function bindToAction(dispatch: any) {
  return {
    customerUpdatePassword: (oldPassword:string,newPassword:string) => 
    dispatch(customerUpdatePassword(oldPassword,newPassword))

  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(CustomerEditPasswordScreen);
