import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  Text,
  Alert,
  Image, AsyncStorage
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import {connect} from 'react-redux';

import styles from '../styles';
import {AvatarItem} from '../../../components';
import {logoutUserService} from '../../../redux/services/user';
import {Header, Input} from '../../../components';
import {
  Thumbnail,
  Item,
  Label,
  List,
  ListItem,
  Body,
  Right,
  Left,
} from 'native-base';
import {TouchableOpacity,TouchableHighlight, ScrollView} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {colors, fonts} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';

import * as Yup from 'yup'; // for everything

import {Formik} from 'formik';
import {getUserInfo, UserInfo} from '../../../redux/actions/profileActions';
import {logOut} from '../../../redux/actions/loginAction';
import { AppState } from '../../../redux/store';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAnt from 'react-native-vector-icons/AntDesign'
import { addAdress, adress, editAdress, getAdress } from '../../../redux/actions/adressAction';
import { ButtonGradient } from '../../../components/ButtonGradient';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  loading: boolean;
  editAdress: (addressId:number,addressInfo:string,title:string) => void;
}

interface itemProp {}

interface State {
    addressId:number;
    addressInfo:string;
    title:string;
}


const addAdressSchema = Yup.object().shape({
    addressInfo: Yup.string()
    .required("Adres bilgisi girilmesi zorunludur."),
    title: Yup.string()
    .required("Adres başlığı girilmesi zorunludur.")

  });
  


class AdressEditScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
        addressId: Number(this.props.navigation.getParam('addressId')),
        addressInfo: this.props.navigation.getParam('addressInfo'),
        title:this.props.navigation.getParam('title')
    };

  }
  _bootstrapAsync = async () => {

    
 
  };


  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Adres Düzenle',
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
    {this.renderContent()}
      </ScrollView></View>;
  }
  handleAddAdress(values) {
      this.props.editAdress(this.state.addressId,values.addressInfo,values.title)
  }
    renderContent() {

        return (
            <View style={{flex:1}}>
          <Formik
                initialValues={{
                    addressInfo: this.state.addressInfo,
                    title: this.state.title
                }}
                validationSchema={addAdressSchema}
                onSubmit={values => this.handleAddAdress(values)}>
                {props => {
                  return (
                    <View style={{padding:20}}>
                      <View >
                        
                        <View>
                        <Text style={{color:colors.textColor,fontSize:16,fontWeight:'600'}}>Adres başlığı</Text> 
                        <Input
                      placeholder="Başlık"
                      style={{color:colors.textColor,paddingLeft:20}}
                      value={props.values.title}
                      onChangeText={props.handleChange("title")}
                      onBlur={props.handleBlur("title")}
                      error={props.touched.title && props.errors.title}
                    />
                    {props.touched.title && props.errors.title && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.title}
                        </Text>
              }
                        </View>
                   
                        <View style={{marginTop:10,minHeight:80}}>
                        <Text style={{color:colors.textColor,fontSize:16,fontWeight:'600'}}>Adres</Text> 
                        <Input

                        multiline
                      placeholder="Adres"
                      style={{color:colors.textColor,paddingLeft:20,minHeight:60}}
                      value={props.values.addressInfo}
                      onChangeText={props.handleChange("addressInfo")}
                      onBlur={props.handleBlur("addressInfo")}
                      error={props.touched.addressInfo && props.errors.addressInfo}
                    />
                    {props.touched.addressInfo && props.errors.addressInfo && <Text style={{fontSize:12,color:colors.accent}}>
                        {props.errors.addressInfo}
                        </Text>
              }
                        </View>
                     
                        <View>
                       
                        </View>
                        <ButtonGradient style={{marginTop:30}} text="Değişiklikleri kaydet" loading={this.props.loading} onPress={props.handleSubmit} />
                    </View>
                    
                    </View>
                  );
                }}
              </Formik>
          
         </View>
        )
    }

}

const mapStateToProps = (state: AppState) => ({
    loading: state.adress.editAdressLoading
});

function bindToAction(dispatch: any) {
  return {
    editAdress: (addressId:number,addressInfo:string,title:string) => 
    dispatch(editAdress(addressId,addressInfo,title))
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(AdressEditScreen);
