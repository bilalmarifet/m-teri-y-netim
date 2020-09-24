import React, { Component } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    TouchableOpacityProps,
    ViewStyle,
    TouchableHighlight,
    StyleProp
} from "react-native";
import { colors } from "../constants";
import { Spinner } from "native-base";
import LinearGradient from "react-native-linear-gradient";

interface Props extends TouchableOpacityProps {
    text: string;
    loading: boolean;
    style?: StyleProp<ViewStyle>
}

export class ButtonGradient extends Component<Props, {}> {
    render() {
        const { text, loading } = this.props;
        return (
            <TouchableHighlight
                disabled={loading} 
                {...this.props}
                underlayColor="#418140"
                style={[{borderRadius:5},this.props.style]}
            >
                <LinearGradient
                    start={{ x: 0.7, y: 0.5 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#54A652', '#7ACE6F']}
                    style={styles.buttonStyle}>
                    {loading ? <Spinner color="white" /> :
                        <Text style={styles.buttonTextStyle}>{text}</Text>}

                </LinearGradient>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5
    },
    buttonTextStyle: {
        color: colors.containerBg,
        fontWeight: "700",
        fontSize: 16
    }
});

