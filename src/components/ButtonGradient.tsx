import React, { Component } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    TouchableOpacityProps,
    ViewStyle,
    TouchableHighlight
} from "react-native";
import { colors } from "../constants";
import { Spinner } from "native-base";
import LinearGradient from "react-native-linear-gradient";

interface Props extends TouchableOpacityProps {
    text: string;
    loading: boolean;
}

export class ButtonGradient extends Component<Props, {}> {
    render() {
        const { text, loading } = this.props;
        return (
            <TouchableHighlight
                disabled={loading} {...this.props}
                onPress={() => this.handleCartAction()}
                underlayColor="#AAA"

            >
                <LinearGradient
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    colors={['#54A652', '#7ACE6F']}
                    style={{

                        justifyContent: 'center',
                    }}>
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
        marginVertical: 16,
        borderRadius: 5
    },
    buttonTextStyle: {
        color: colors.containerBg,
        fontWeight: "700",
        fontSize: 16
    }
});

