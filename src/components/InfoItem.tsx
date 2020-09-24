import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  View,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {colors, fonts} from '../constants';
import {CardItem, Body} from 'native-base';

interface Props extends TouchableOpacityProps {
  text: string;
  imageResource?: ImageSourcePropType;
}

export class InfoItem extends Component<Props, {}> {
  render() {
    const {text, style, imageResource} = this.props;
    return (
      <View style={style}>
        <View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {imageResource ? (
              <Image source={imageResource} style={{width: 75, height: 75}} />
            ) : (
              <Image source={require('../images/not-found.png')} />
            )}

            <Text
              style={{
                marginTop: 10,
                color: '#333',
                fontSize: 18,
                fontFamily: fonts.primaryFont,
                textAlign: 'center',
              }}>
              {text}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.primary,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonTextStyle: {
    color: colors.containerBg,
    fontWeight: '700',
    fontSize: 16,
  },
});
