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
import {Header} from '../../../components';
import styles from '../styles';
import {AvatarItem} from '../../../components';
import {logoutUserService} from '../../../redux/services/user';
import {
  Thumbnail,
  Item,
  Label,
  Input,
  List,
  ListItem,
  Body,
  Right,
  Left,
  Spinner,
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
import { adress, getAdress } from '../../../redux/actions/adressAction';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  getAdress : () => void;
  addressList: adress[]
  loading: boolean;
}

interface itemProp {}

interface State {}

class MyAdressesScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
     
    };

  }
  _bootstrapAsync = async () => {

    
 
  };
  componentDidMount() {
    this.props.getAdress()
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Adreslerim',
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
    renderContent() {
        console.log(global.CUSTOMER_ID)

        if(this.props.loading) {
            return(
                   <View style={{flex: 1,justifyContent:"center",alignSelf:'center'}}>
                <Spinner color={colors.IconColor} />

                </View>
            )
        }
        return (
            <View>
                <Text style={{fontFamily:fonts.primaryFont,color:colors.textColor,padding:10}}>Kayıtlı Adreslerim</Text>
                <FlatList
                bounces={false}
            contentContainerStyle={{ paddingTop: 0 }}
            data={this.props.addressList}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => {
              return (
                <TouchableHighlight underlayColor="#AAA" onPress={()=> {
                  item.id === 0 ? this.props.navigation.navigate('CustomerEditProfile') : this.props.navigation.navigate('EditAdress',{addressId: item.id,addressInfo:item.addressInfo,title:item.title})
                }} style={styles.itemAdress}>
                 <View>
                     <View style={{ flexDirection: 'row'}}>
                    <Icon name="ios-home" style={{fontSize:20}} />
                 <View style={{marginLeft:10,flex:1}}>
                 <Text
                        style={{
                        
                          fontFamily: fonts.primaryFont,
                          color: colors.textColor,
                          marginRight:10
                        }}>
                        {item.title}
                      </Text>
                      <Text style={{fontFamily:fonts.primaryFont,
                      color:colors.textColorLighter,marginTop:5}}>
                      {item.addressInfo}
                  </Text>
                 </View>
                 <IconAnt name="right" style={{justifyContent:'center',alignSelf:'center',fontSize:15,color:colors.IconColor}} />
                  </View>
                 
                  </View>
                </TouchableHighlight>
              );
            }}


          />

          <TouchableHighlight underlayColor="#AAA" onPress={()=> this.props.navigation.navigate('AddAdress')} style={{padding:10,backgroundColor:'white',marginTop:20,borderTopWidth:0.5,
    borderTopColor:'#cccc',borderBottomWidth:0.5,
    borderBottomColor:'#cccc'}}>
             <View style={{flexDirection:'row'}}>
             <IconAnt name="pluscircleo" style={{fontSize:25,color:colors.IconColor}} />
              <Text style={{fontFamily:fonts.primaryFont,color:colors.textColorLighter,justifyContent:'center',alignSelf:'center',marginLeft:10}}>Yeni Adres Ekle</Text>
             </View>
          </TouchableHighlight>
            </View>
        )
    }

}

const mapStateToProps = (state: AppState) => ({
    addressList: state.adress.adress,
    loading: state.adress.loading
});

function bindToAction(dispatch: any) {
  return {
    getAdress : () => 
    dispatch(getAdress())
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(MyAdressesScreen);
