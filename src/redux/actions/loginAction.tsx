import {AsyncStorage} from 'react-native';

import axios from 'axios';
import {WATER_USER_LOGIN} from './../constants';
import {Dispatch} from 'react';
import {
  LOGIN_FAILED,
  LOGIN_STARTED,
  LOGIN_SUCCEED,
  RESET_PROPS,
} from './../types';
import {Action} from '../states';
import {navigate} from '../services/Navigator';
import {NavigationScreenProp, NavigationState} from 'react-navigation';
import NavigationService from '../../services/NavigationService';

export function loginUserService(username: string, password: string) {
  return (dispatch: Dispatch<Action>) => {
    console.log(username + password);

    dispatch(loading(true));

    axios
      .post(WATER_USER_LOGIN, {
        username: username,
        password: password,
      })
      .then(response => {
        if (response.data.isSuccess) {
          console.log(response.data.result);
          let storeOwnerUserId = response.data.result.storeUserId;
          let customerId = response.data.result.customerId;
          var arr = [
            ['userToken', response.data.result.token],
            ['UserType', response.data.result.userType.toString()],
          ];
          if (storeOwnerUserId && customerId) {
            arr.push(
              ['storeOwnerUserId', storeOwnerUserId.toString()],
              ['customerId', response.data.result.customerId.toString()],
            );
          }

          console.log(storeOwnerUserId, 'storeOwnerUserId');
          AsyncStorage.multiSet(arr);
          AsyncStorage.setItem('userToken', response.data.result.token)
            .then(() => {
              AsyncStorage.setItem(
                'userId',
                response.data.result.userId.toString(),
              ).then(() => {
                AsyncStorage.setItem(
                  'UserType',
                  response.data.result.userType.toString(),
                ).then(() => {
                  dispatch(loginIsSucceed(true, ''));
                  NavigationService.navigate('AuthLoading')
                  dispatch(reset());
                });
              });
            })
            .catch(error => {
              console.log(error);
              dispatch(loginIsSucceed(false, error));
              dispatch(reset());
            });
        } else {
          if (response.data.message == 'User.Login.UserNotFound') {
            dispatch(loginIsSucceed(false, 'Böyle bir kullanıcı bulunamadı!'));
            dispatch(reset());
          }
        }
      })
      .catch(err => {
        dispatch(loginIsSucceed(false, err));
        // dispatch(reset());
        dispatch(reset());
      });
  };
}

export function logOut(navigation?: NavigationScreenProp<NavigationState>) {
  return (dispatch: Dispatch<Action>) => {
    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys))
      .then(() => {
        if (navigation) {
          navigation.navigate('AuthLoading', {});
        } else {
          navigate('AuthLoading', {});
        }
      });
  };
}
export function logoutUserService() {
  return new Promise((resolve, reject) => {
    AsyncStorage.multiRemove(['userToken', 'userId'])
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

export const loading = (loader: boolean) => ({
  type: LOGIN_STARTED,
  payload: loader,
});

export const loginIsSucceed = (loginIsSucced: boolean, message: string) => ({
  type: loginIsSucced ? LOGIN_SUCCEED : LOGIN_FAILED,
  payload: message,
});

export const reset = () => ({
  type: RESET_PROPS,
  payload: null,
});
