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
import { FlatList } from 'react-native-gesture-handler';
import { District } from '../../../redux/actions/DistrictAction';
import  Icon  from 'react-native-vector-icons/Feather';

// import Icon from 'react-native-vector-icons/Ionicons'
// import { Input } from "react-native-elements";

// const logo = require("./water.png");

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  districtList: District[];
}




interface State {
selectedDistrictId: number
}
class DistrictSelectionScreen extends Component<Props, State> {
  static navigationOptions = (screenProps: NavigationScreenProps) => {
    return {
      headerStyle: {
      },
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
        selectedDistrictId: 0
    }

  }

 
  renderItem(element:District) {
      return (
          <TouchableOpacity onPress={()=>this.setState({selectedDistrictId: element.id})} style={{borderBottomColor:colors.borderColor,borderBottomWidth:0.5,paddingVertical:10,flexDirection:'row',justifyContent:'space-between',height:50}}>
              <Text style={{alignSelf:'center'}}>{element.districtName}</Text>
                {this.state.selectedDistrictId === element.id ? <Icon  name="check" style={{marginRight:15,fontSize:18,color:colors.IconColor}} /> : null} 
          </TouchableOpacity>
      )
  }
  sendToSignUp()
  {
    this.props.navigation.setParams({'DistrictId' : this.state.selectedDistrictId})
    this.props.navigation.navigate("SignUpSecond",{DistrictId: this.state.selectedDistrictId})
  }


  render() {

    return (
      <View style={{flex:1}}>
        <SafeAreaView>

        <ScrollView style={{}}>
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
                          <Text style={{fontFamily:fonts.primaryFont, color:'#ccc'}}>mahalleni seç</Text>
                        </View>
                        </View>
                       <Text style={{textAlign:'center',fontFamily:fonts.primaryFont,fontSize:18,marginBottom:20}}>Hizmet verdiğimiz mahalleler</Text>
                        </View>
                       
                        <FlatList
        contentContainerStyle={{paddingHorizontal:20,flexGrow:1}} data={this.props.districtList}
         renderItem={({ item }) => (
            this.renderItem(item)
          )} 
          ListFooterComponent={<SuccessButton disabled={this.state.selectedDistrictId === 0 } text="Devam et" style={{marginTop:20,marginBottom:50}} onPress={()=> this.sendToSignUp()} />
        }/>
                        </ScrollView>
       
         </SafeAreaView>
           </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
districtList: state.District.DistrictList
});

function bindToAction(dispatch: any) {
  return {
  
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(DistrictSelectionScreen);
