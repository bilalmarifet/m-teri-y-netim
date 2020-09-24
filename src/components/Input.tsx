import React, { Component } from "react";
import { TextInput, StyleSheet, TextInputProps, StyleProp, TextStyle } from "react-native";
import { colors } from "../constants";

interface Props extends TextInputProps {
  error?: any;
  style?:StyleProp<TextStyle>
}

export class Input extends Component<Props, {}> {
  render() {
    const { error,style } = this.props;
    return (
      <TextInput
      {...this.props}
        style={[
          styles.inputStyle,
          { borderBottomColor: error ? colors.accent : colors.borderColor },
          style
        ]}
        
      />
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    fontSize: 16,
    marginVertical: 10,
  }
});
