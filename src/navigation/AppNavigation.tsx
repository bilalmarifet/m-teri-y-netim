import React from "react";
import {
  
  createAppContainer,
  createSwitchNavigator,
} from "react-navigation";
import {createStackNavigator} from  'react-navigation-stack'
import { AsyncStorage, Dimensions, Image } from "react-native";
import {createDrawerNavigator} from 'react-navigation-drawer'
const { width } = Dimensions.get("window");
import {createBottomTabNavigator} from 'react-navigation-tabs'
import Home from "../screens/AppScreens/Home";
import Blank from "../screens/AppScreens/Blank";
import SideBar from "../screens/AppScreens/SideBar";
import Login from "../screens/AuthScreens/Login";
import AuthLoading from "../screens/AuthLoading";
import CustomerHomeScreen from '../screens/AppScreens/Home/index';

import CartScreen from '../screens/AppScreens/Cart/CartScreen';
import OrderScreen from '../screens/AppScreens/Order/OrderScreen';
import CustomerProfileScreen from '../screens/AppScreens/Profile/CustomerProfileScreen';

import {fonts, colors} from '../constants';
import SignUpFirstScreen from "../screens/AuthScreens/SignUp/SignUpFirstScreen";
import SignUpSecondScreen from "../screens/AuthScreens/SignUp/SignUpSecondScreen";

import CustomerEditProfileScreen from "../screens/AppScreens/Profile/CustomerEditProfileScreen";
import CustomerEditPasswordScreen from "../screens/AppScreens/Profile/CustomerEditPasswordScreen";
import OrderDetailScreen from "../screens/AppScreens/Order/OrderDetailScreen";
import CartCheckoutScreen from "../screens/AppScreens/Cart/CartCheckoutScreen";
import Icon from "react-native-vector-icons/Feather";
import DistrictSelectionScreen from "../screens/AuthScreens/SignUp/DistrictSelectionScreen";

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
      headerTintColor : colors.headerTitleColor,
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight:'bold',
        color:colors.headerTitleColor,
        fontFamily: fonts.primaryFont,
      },
    },
  },
);


const AuthStack = createStackNavigator(
  {
    Login: { screen: Login },
    SignUp: SignUpFirstScreen,
    SignUpSecond: SignUpSecondScreen,
    DistrictSelection: DistrictSelectionScreen
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);

const cartStack = createStackNavigator(
  {
    Cart: CartScreen,
    CartCheckout: CartCheckoutScreen
  },
  {
    initialRouteName: 'Cart',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor : colors.headerTitleColor,
      headerTitleStyle: {
        fontSize: 18,
        fontWeight:'bold',
        fontFamily: fonts.primaryFont,
        color:colors.headerTitleColor,

      },
    },
  },
);


const CustomerOrderStack = createStackNavigator(
  {
    Order: {screen: OrderScreen},
    OrderDetail: OrderDetailScreen
  },
  {
    initialRouteName: 'Order',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor : colors.headerTitleColor,
      headerTitleStyle: {
        fontSize: 18,
        fontWeight:'bold',
        fontFamily: fonts.primaryFont,
        color:colors.headerTitleColor,
      },
    },
  },
);

const CustomerProfileStack = createStackNavigator(
  {
    Profile:  CustomerProfileScreen,
    CustomerEditProfile: CustomerEditProfileScreen,
    CustomerEditPassword: CustomerEditPasswordScreen
  },
  {
    initialRouteName: 'Profile',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor : colors.headerTitleColor,
      headerTitleStyle: {
        fontSize: 18,
        fontWeight:'bold',
        fontFamily: fonts.primaryFont,
        color:colors.headerTitleColor,
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
          activeTintColor: colors.IconColor,
        },
        tabBarIcon: ({focused}) => {
          return focused ? (
            <Icon name="shopping-bag" style={{color: colors.IconColor,fontSize:30}}  />

      
          ) : (
            <Icon name="shopping-bag" style={{color: colors.IconNormalColor,fontSize:30}}  />

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
          activeTintColor: colors.IconColor,
        },

        tabBarIcon: ({focused}) => {
          return focused ? (
            <Icon name="shopping-cart"  style={{color: colors.IconColor,fontSize:30}}  />

            
          ) : (
            <Icon name="shopping-cart" style={{color: colors.IconNormalColor,fontSize:30}}  />

            
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
            <Icon name="briefcase" style={{color: colors.IconColor,fontSize:30}}  />

            
          ) : (
            <Icon name="briefcase"  style={{color: colors.IconNormalColor,fontSize:30}}  />

            
          );
        },
      },
    },
    Profile: {
      screen: CustomerProfileStack,
      navigationOptions: {
        tabBarLabel: 'Profil',
        tabBarOptions: {
          labelStyle: {
            color: colors.headerColor,
          },
        },
        tabBarIcon: ({focused}) => {
          return focused ? (
            <Icon name="user" style={{color: colors.IconColor,fontSize:30}}  />

            
          ) : (
            <Icon name="user" style={{color: colors.IconNormalColor,fontSize:30}}  />

            
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