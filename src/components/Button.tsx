import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle
} from "react-native";
import { colors } from "../constants";
import { Spinner } from "native-base";

interface Props extends TouchableOpacityProps {
  text: string;
  loading: boolean;
}

export class Button extends Component<Props, {}> {
  render() {
    const { text,loading } = this.props;
    return (
      <TouchableOpacity disabled={loading} {...this.props} style={styles.buttonStyle} >
       {loading ? <Spinner color="white" /> :
        <Text style={styles.buttonTextStyle}>{text}</Text> }

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
    color: colors.containerBg,
    fontWeight: "700",
    fontSize: 16
  }
});
