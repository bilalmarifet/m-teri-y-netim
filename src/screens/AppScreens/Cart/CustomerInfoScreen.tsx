import React, { Component } from "react";
import { View, FlatList, ActivityIndicator,Button,Text} from "react-native";
import { NavigationScreenProp, NavigationState, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Header } from "../../../components";
import styles from "../styles";
import { AvatarItem } from "../../../components";
import { logoutUserService } from "../../../redux/services/user";
import {Thumbnail,Icon, Item, Label, Input} from 'native-base'
import {
  fetchImageData,
  fetchMoreImageData
} from "../../../redux/actions/fetch";
import { TouchableOpacity } from "react-native-gesture-handler";
import { showMessage } from "react-native-flash-message";
import { colors, fonts } from "../../../constants";
import LinearGradient from 'react-native-linear-gradient';

import * as Yup from 'yup'; // for everything


import { Formik } from "formik";


interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  fetchImageData: (page?: number, limit?: number) => void;
  fetchMoreImageData: (page?: number, limit?: number) => void;
  imageData: any;
  loading: boolean;
}

interface itemProp {
  item: any;
}

interface State {
  page: number;
  limit: number;
  change :boolean;
}

const girdiler = Yup.object().shape({
    nameSurname: Yup.string().required("İsim soyisim boş olamaz."),
    adress: Yup
    .string()
      .required("Adres boş olamaz.").min(5,"Adres minimum 5 karakter uzunluğunda olmalı"),
    phoneNumber: Yup.string().required("Telefon numarası boş olamaz.").min(10,"Telefon numarası minimum 10 karakter uzunluğunda olmalı").max(13,"Telefon numarası maximum 13 karakter uzunluğunda olmalı")
});

class CustomerInfoScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
      limit: 20,
      change : false,
    };
  }

  componentDidMount() {
    const { fetchImageData } = this.props;
    const { page, limit } = this.state;
    fetchImageData(page, limit);
    // this.props.navigation.setParams({cart: 1});
  }

  handleLogout = () => {
    const { navigation } = this.props;
    logoutUserService().then(() => {
      navigation.navigate("AuthStack");
    });
  };

  static navigationOptions = ({navigation }) => {

   return {
    title: 'Kişisel Bilgiler',

    headerStyle: {
      backgroundColor: colors.headerColor,
      height: 100,

      headerTitleStyle: {
        fontWeight: '600',
        fontFamily: 'Avenir Next',
        fontSize: 18
      },

    },
   }
  };
  renderMaskedInput(value : string) {
    if(value.length === 0 ) {
        return (
            <View>
      <Text>
            +90-5333728696
      </Text>
      
            </View>
          );
    }
   else {
    return (
        <View>
  <Text>
        {value.length > 2 ? `${value.substr(0, 3)} - ${value.substr(3, 10)}` : value}
  </Text>
  
        </View>
      );
   }
  }
  
  sendInfo(values) {

  }


  render() {
    const { navigation, imageData, fetchMoreImageData, loading } = this.props;
    const { page, limit } = this.state;
    return (


      <View style={styles.container}>
          

          <Formik
                initialValues={{nameSurname : "",phoneNumber:"",adress :""}}
                validationSchema={girdiler}
                onSubmit={values => this.sendInfo(values)}
              >
                {props => {
                  return (
                    <View style={{flex:1}}>



<Item>
            <Input style={{fontFamily:fonts.primaryFont}}
             placeholder="İsim soyisim"
             value={props.values.nameSurname}


                          onChangeText={props.handleChange("nameSurname")}
                          onBlur={props.handleBlur("nameSurname")}
             />
          </Item>
                  {props.errors.nameSurname && props.touched.nameSurname && <Text style={{margin:5,fontFamily:fonts.primaryFont,color:colors.accent}}>{props.errors.nameSurname}</Text>}
          <Item>
            <Input  style={{fontFamily:fonts.primaryFont}}
             placeholder="Telefon Numarası" 
             value={props.values.phoneNumber}
            maxLength={13}

             onChangeText={props.handleChange("phoneNumber")}
             onBlur={props.handleBlur("phoneNumber")}
             />
          </Item>
          {props.errors.phoneNumber && props.touched.phoneNumber && <Text style={{margin:5,fontFamily:fonts.primaryFont,color:colors.accent}}>{props.errors.phoneNumber}</Text>}

          <Item>
            <Input  style={{fontFamily:fonts.primaryFont,minHeight:50}}
            multiline
             placeholder="Adres"

             value={props.values.adress}


             onChangeText={props.handleChange("adress")}
             onBlur={props.handleBlur("adress")}
             />
          </Item>
          {props.errors.adress && props.touched.adress && <Text style={{margin:5,fontFamily:fonts.primaryFont,color:colors.accent}}>{props.errors.adress}</Text>}

          <TouchableOpacity onPress={()=> props.handleSubmit()}
        style={{backgroundColor:colors.headerColor,borderRadius:5,width:200,padding:10,alignSelf:'center',marginTop:20}}>

           <Text style={{alignSelf:'center',marginLeft:10,color:'white',fontFamily:fonts.primaryFont}}>Alışverişi Tamamla</Text>
       </TouchableOpacity>
                    </View>
                  );
                }}
              </Formik>
       
       
       
        


          {/* <MaskedInput
          caretHidden
            ref={r => (this.minput = r)}

            renderMaskedText={this.renderMaskedInput}
            keyboardType={'phone-pad'}
            value={''}
          /> */}

      </View>
    );
  }
}

const mapStateToProps = (state: any) => ({
  imageData: state.data,
  loading: state.loading
});

function bindToAction(dispatch: any) {
  return {
    fetchImageData: (page?: number, limit?: number) =>
      dispatch(fetchImageData(page, limit)),
    fetchMoreImageData: (page?: number, limit?: number) =>
      dispatch(fetchMoreImageData(page, limit))
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(CustomerInfoScreen);
