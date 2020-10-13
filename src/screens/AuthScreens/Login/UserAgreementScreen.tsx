import { Spinner } from "native-base";
import React, { Component } from "react";
import {
    View,
    FlatList,
    StatusBar,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Modal,
    TextInput,
} from "react-native";
import { NavigationScreenProp, NavigationState, ScrollView, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { colors, fonts } from "../../../constants";
import { forgotPassword, getUserAgreement } from "../../../redux/actions/loginAction";
import { AppState } from "../../../redux/store";

interface Props {
    navigation: NavigationScreenProp<NavigationState>;
    loading: boolean;
    aggrement: string;
    getUserAgreement : () => void;
}


class UserAgreementScreen extends Component<Props,{}> {

  
    static navigationOptions = ({ navigation }) => {
        return {
          title: 'Kullanıcı Sözleşmesi',
    
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
        
      componentDidMount(){
          this.props.getUserAgreement()
      }

renderContent() {
    if(this.props.loading || !this.props.aggrement) {
        return (
            <View style={{flex: 1,justifyContent:"center",alignSelf:'center'}}>
                <Spinner color={colors.IconColor} />
        </View>
        )
    }else {
        return (
            <ScrollView>
                                              <View style={{padding:20}}>

                                              <Text
                                                        style={{
                                                            fontFamily: fonts.primaryFont,
                                                            fontSize: 32,
                                                        }}>
                                                        Gizlilik Sözleşmesi
                          </Text>
                                                    <Text style={{ fontFamily: fonts.primaryFont, color: '#ccc' }}>Uygulama gizlilik sözleşmesi</Text>
                                             
                                             
                                              </View>
                                                    <Text style={{paddingHorizontal:20,fontFamily:'Avenir Next',fontSize:14}}>
                {this.props.aggrement}
                </Text>
                                            
                                                </ScrollView>
           
        )
    }
}
  
    render() {
        return (
            <SafeAreaView style={{ flex: 1,
                backgroundColor: colors.containerBg}}>

               {this.renderContent()}
            



            </SafeAreaView>
        );
    }
}


const mapStateToProps = (state: AppState) => ({
    loading: state.login.loadingForAgreement,
    aggrement: state.login.agremeent
});

function bindToAction(dispatch: any) {
  return {
    getUserAgreement : () =>
    dispatch(getUserAgreement())
  };
}

export default connect(
  mapStateToProps,
  bindToAction,
)(UserAgreementScreen);