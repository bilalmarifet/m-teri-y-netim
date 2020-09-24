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
import CustomerProfileScreen from '../screens/AppScreens/Profile/CustomerProfileScreen';

import {fonts, colors} from '../constants';
import SignUpFirstScreen from "../screens/AuthScreens/SignUp/SignUpFirstScreen";
import SignUpSecondScreen from "../screens/AuthScreens/SignUp/SignUpSecondScreen";
import { Icon } from "native-base";
import CustomerEditProfileScreen from "../screens/AppScreens/Profile/CustomerEditProfileScreen";
import CustomerEditPasswordScreen from "../screens/AppScreens/Profile/CustomerEditPasswordScreen";
import OrderDetailScreen from "../screens/AppScreens/Order/OrderDetailScreen";

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
    Profile: CustomerProfileScreen,
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
            <Icon name="shopping-bag" type="Feather"   style={{color: colors.IconColor}}  />

      
          ) : (
            <Icon name="shopping-bag" type="Feather"   style={{color: colors.IconNormalColor}}  />

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
            <Icon name="shopping-cart" type="Feather"    style={{color: colors.IconColor}}  />
            
          ) : (
            <Icon name="shopping-cart" type="Feather" style={{color: colors.IconNormalColor}}  />
            
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
            <Icon name="briefcase" type="Feather"   style={{color: colors.IconColor}} />
            
          ) : (
            <Icon name="briefcase" type="Feather" style={{color: colors.IconNormalColor}}  />
            
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
            <Icon name="user" type="Feather"   style={{color: colors.IconColor}} />
            
          ) : (
            <Icon name="user" type="Feather" style={{color: colors.IconNormalColor}}  />
            
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
