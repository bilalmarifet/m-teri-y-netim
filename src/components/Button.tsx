import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle, StyleProp
} from "react-native";
import { colors } from "../constants";
import { Icon, Spinner } from "native-base";

interface Props extends TouchableOpacityProps {
  text: string;
  loading: boolean;
  style?:StyleProp<ViewStyle>;
  textStyle  ? :StyleProp<ViewStyle>;
}

export class Button extends Component<Props, {}> {
  render() {
    const { text,loading } = this.props;
    return (
      <TouchableOpacity disabled={loading} {...this.props} style={[styles.buttonStyle, this.props.style]} >
       {loading ? <Spinner color="white" /> :
        <Text style={[styles.buttonTextStyle, this.props.textStyle]} >{text}</Text> }
          <Icon name="chevron-right" style={{ color: colors.IconNormalColor,  fontSize: 18 }} type="Feather" />

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
    fontWeight: "700",
    fontSize: 16
  }
});
