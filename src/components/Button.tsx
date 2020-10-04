import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle, StyleProp, TextStyle
} from "react-native";
import { colors } from "../constants";
import { Icon, Spinner } from "native-base";

interface Props extends TouchableOpacityProps {
  text: string;
  loading: boolean;
  style?:StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export class Button extends Component<Props, {}> {
  render() {
    const { text,loading } = this.props;
    return (
      <TouchableOpacity disabled={loading} {...this.props} style={[styles.buttonStyle, this.props.style]} >
     
        <Text style={[styles.buttonTextStyle, this.props.textStyle]} >{text}</Text> 
    {loading ? <Spinner size={18} color="white" /> :<Icon name="chevron-right" style={{ color: 'white',  fontSize: 18 }} type="Feather" /> }

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.headerColor,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    borderRadius:5
  },
  buttonTextStyle: {

                    marginLeft:5,
                    fontFamily: 'Roboto',
                    fontWeight: '600',
                    paddingTop:2,
                    alignSelf: 'center',
                    color: '#fff',

  }
});
