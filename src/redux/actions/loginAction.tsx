import {AsyncStorage} from 'react-native';

import axios from 'axios';
import {WATER_USER_LOGIN} from './../constants';
import {Dispatch} from 'react';
import {
  LOGIN_FAILED,
  LOGIN_STARTED,
  LOGIN_SUCCEED,
  LOGOUT,
  RESET_PROPS,
} from './../types';
import {Action} from '../states';
import {navigate} from '../services/Navigator';
import {NavigationScreenProp, NavigationState} from 'react-navigation';
import NavigationService from '../../services/NavigationService';
import { showSimpleMessage } from '../../components/showMessage';
import { BasestoreId } from '../../services/AppConfig';

export function loginUserService(username: string, password: string) {
  return (dispatch: Dispatch<Action>) => {


    dispatch(loading(true));

    axios
      .post(WATER_USER_LOGIN, {
        username: username,
        password: password,
        storeId : BasestoreId
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
              showSimpleMessage("Bir hata meydana geldi.Tekrar deneyiniz","danger")
              dispatch(reset());
            });
        } else {
          if (response.data.message == 'User.Login.UserNotFound') {
            showSimpleMessage("Böyle bir kullanıcı bulunamadı.","danger")
            dispatch(reset());
          }
        }
      })
      .catch(err => {
        dispatch(loginIsSucceed(false, err));
        showSimpleMessage("Böyle bir kullanıcı bulunamadı.","danger")
        dispatch(reset());
      });
  };
}

export function logOut(navigation?: NavigationScreenProp<NavigationState>) {
  return (dispatch: Dispatch<Action>) => {
    global.TOKEN=undefined;
    global.CUSTOMER_ID = undefined;
    global.USERID = undefined;

    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys))
      .then(() => {
        dispatch(logout());
        NavigationService.navigate('Login', {});
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

export const logout = () => ({
  type: LOGOUT,
  payload: "",
});


export const loginIsSucceed = (loginIsSucced: boolean, message: string) => ({
  type: loginIsSucced ? LOGIN_SUCCEED : LOGIN_FAILED,
  payload: message,
});

export const reset = () => ({
  type: RESET_PROPS,
  payload: null,
});
