import React, { Component } from "react";
import { View,Text, AsyncStorage} from "react-native";
import { colors } from "../constants";
import { WATER_GET_NOTIFICATIONS, WATER_GET_NEW_NOTIFICATION_COUNT } from "../redux/constants";
import {  getNotifications, INotificationItem } from '../redux/actions/notificationAction';

import axios from 'axios'
import { AppState } from '../redux/store';
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Feather";
interface Props {
    name: string;
    focused :boolean;
    badgeCount:number;
}


export  class IconBadge extends Component<Props, {}> {

  render() {
    const { name } = this.props;
    return (
        <View style={{ width: 24, height: 24, margin: 5 }}>
          <Icon name={name}  style={{color: this.props.focused ? '#2069F3':'', fontSize:24}} />
          {this.props.badgeCount && this.props.badgeCount!=0 && (
            <View
              style={{
                // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
                position: 'absolute',
                right: -10,
                top: -5,
                backgroundColor: 'red',
                borderRadius: 10,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }} 
            >
            
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                {this.props.badgeCount && this.props.badgeCount.toString()}
              </Text>
            </View>
          )}
        </View>
      );
  }
}

