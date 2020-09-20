import React, {Component} from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../constants';
import {NavigationScreenProp, NavigationState} from 'react-navigation';
import {IProductItemCustomer} from '../redux/actionsCustomer/ProductAction';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'native-base';

interface Props extends TextInputProps {
  navigation: NavigationScreenProp<NavigationState>;
  productList: IProductItemCustomer[];
}

export class TotalPriceText extends Component<Props, {}> {
  render() {
    const {productList} = this.props;

    var totalPrice = 0;
    productList
      ? productList.length > 0
        ? productList.map(e => (totalPrice += e.count * e.price))
        : null
      : null;

    return totalPrice ? (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Cart')}
        style={{marginRight: 10}}>
        <LinearGradient
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
          colors={['#EFFAF7', '#A9CDCC']}
          style={{borderRadius: 5}}>
          <View
            style={{
              borderWidth: 0,
              borderRadius: 5,
              padding: 5,
              flexDirection: 'row',
              backgroundColor: 'white',
              margin: 1,
            }}>
            <Icon style={{color: colors.iconColor,fontSize:20}} name="cart" />

            <Text
              style={{
                alignSelf: 'center',
                marginLeft: 6,
                color: colors.textColor,
              }}>
              {totalPrice} TL
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    ) : null;
  }
}
