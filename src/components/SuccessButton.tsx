
import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle, View
} from "react-native";
import { colors } from "../constants";
import { Icon, Spinner } from "native-base";
import LinearGradient from "react-native-linear-gradient";

interface Props extends TouchableOpacityProps {
  text: string;
  loading: boolean;
}

export class SuccessButton extends Component<Props, {}> {
  render() {
    const { text,loading } = this.props;
    return (     
         <TouchableOpacity disabled={loading} {...this.props}  >
        <LinearGradient
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        colors={['#30AE4A', '#7BAD7B']}
        style={{
          borderRadius: 5,
          marginTop: 10,
          backgroundColor: colors.buttonBackgroundPrimary,
          flexDirection: 'row',
          paddingTop: 5,
          paddingHorizontal: 10,
          paddingBottom: 10,
          justifyContent: 'space-between',
          height:45
        }}>

    
              <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontWeight: '600',
                    paddingTop:2,
                    alignSelf: 'center',
                    color: '#fff',
                  }}>
                        {text}
            </Text>
   
      
              </View>
 
            <View>
              {loading ? (
                <Spinner size="small" color="white" style={{ height: 35, width: 35 }} />
              ) : (
                  <Icon name="chevron-right" style={{ color: 'white', marginTop: 10, fontSize: 18 }} type="Feather" />

                )}
            </View>
         

      </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({

  buttonTextStyle: {
    color:'#fff',
    fontWeight: "700",

    fontSize: 16
  }
});
