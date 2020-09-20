import React from "react";
import {
  
  createAppContainer,
  createSwitchNavigator,
} from "react-navigation";
import {createStackNavigator} from  'react-navigation-stack'
import { Dimensions, Image } from "react-native";
import {createDrawerNavigator} from 'react-navigation-drawer'
const { width } = Dimensions.get("window");
import {createBottomTabNavigator} from 'react-navigation-tabs'
import Home from "../screens/AppScreens/Home";
import Blank from "../screens/AppScreens/Blank";
import SideBar from "../screens/AppScreens/SideBar";
import Login from "../screens/AuthScreens/Login";
import AuthLoading from "../screens/AuthLoading";
import CustomerHomeScreen from '../screens/AppScreens/Home/index';
import CustomerInfoScreen from '../screens/AppScreens/Cart/CustomerInfoScreen'
import CartScreen from '../screens/AppScreens/Cart/CartScreen';
import OrderScreen from '../screens/AppScreens/Order/OrderScreen';
import CustomerProfileScreen from '../screens/AppScreens/Order/CustomerProfileScreen';

import {fonts, colors} from '../constants';
import SignUpFirstScreen from "../screens/AuthScreens/SignUp/SignUpFirstScreen";
import SignUpSecondScreen from "../screens/AuthScreens/SignUp/SignUpSecondScreen";

const MainStack = createStackNavigator(
  {
    Home: { screen: Home }
  },
  {
    initialRouteName: "Home",
    // headerMode: "none"
  }
);

const CustomerMain = createStackNavigator(
  {
    CustomerHome: {screen: CustomerHomeScreen},
  },
  {
    initialRouteName: 'CustomerHome',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#D6E4FF',
      },
      headerTitleStyle: {
        fontSize: 18,
        fontFamily: fonts.primaryFont,
      },
    },
  },
);


const AuthStack = createStackNavigator(
  {
    Login: { screen: Login },
    SignUp: SignUpFirstScreen,
    SignUpSecond: SignUpSecondScreen
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);

const cartStack = createStackNavigator(
  {
    Cart: CartScreen,
    CustomeInfo: CustomerInfoScreen,
  },
  {
    initialRouteName: 'Cart',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#D6E4FF',
      },
      headerTitleStyle: {
        fontSize: 18,
        fontFamily: fonts.primaryFont,
      },
    },
  },
);


const CustomerOrderStack = createStackNavigator(
  {
    Order: {screen: OrderScreen},
    Profile: CustomerProfileScreen,
  },
  {
    initialRouteName: 'Order',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#D6E4FF',
      },
      headerTitleStyle: {
        fontSize: 18,
        fontFamily: fonts.primaryFont,
      },
    },
  },
);



const CustomerMainStack = createBottomTabNavigator(
  {
    Products: {
      screen: CustomerMain,
      navigationOptions: {
        tabBarLabel: 'Ürünler',
        tabBarOptions: {
          labelStyle: {
            color: colors.headerColor,
          },
        },
        tabBarIcon: ({focused}) => {
          return focused ? (
            <Image
              style={{width: 24, height: 24}}
              source={require('../assets/plastic-4.png')}
            />
          ) : (
            <Image
              style={{width: 24, height: 24}}
              source={require('../assets/plastic-5.png')}
            />
          );
        },
      },
    },
    Cart: {
      screen: cartStack,
      navigationOptions: {
        tabBarLabel: 'Sepet',
        tabBarOptions: {
          labelStyle: {
            color: colors.headerColor,
          },
        },

        tabBarIcon: ({focused}) => {
          return focused ? (
            <Image
              style={{width: 24, height: 24}}
              source={require('../assets/shopping-cart.png')}
            />
          ) : (
            <Image
              style={{width: 24, height: 24}}
              source={require('../assets/shopping-cart-2.png')}
            />
          );
        },
      },
    },
    Order: {
      screen: CustomerOrderStack,
      navigationOptions: {
        tabBarLabel: 'Siparişlerim',
        tabBarOptions: {
          labelStyle: {
            color: colors.headerColor,
          },
        },
        tabBarIcon: ({focused}) => {
          return focused ? (
            <Image
              style={{width: 24, height: 24}}
              source={require('../assets/order-2.png')}
            />
          ) : (
            <Image
              style={{width: 24, height: 24}}
              source={require('../assets/checklist.png')}
            />
          );
        },
      },
    },
  },
  {
    initialRouteName: 'Products',
  },
);



export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      AuthStack: AuthStack,
      AppStack: CustomerMainStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
