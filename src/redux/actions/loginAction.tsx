import {AsyncStorage} from 'react-native';

import axios from 'axios';
import {WATER_GET_USER_TERM, WATER_UPDATE_PASSWORD_FORGOT, WATER_USER_FORGOT_PASSWORD, WATER_USER_LOGIN} from './../constants';
import {Dispatch} from 'react';
import {
  APP_KILLED,
  GET_USER_AGREEMENT,
  GET_USER_AGREEMENT_IPTAL,
  GET_USER_AGREEMENT_MESAFE,
  LOADING_FORGOT_PASSWORD,
  LOADING_FORGOT_PASSWORD_CHANGE,
  LOADING_USER_AGREEMENT,
  LOADING_USER_AGREEMENT_IPTAL,
  LOADING_USER_AGREEMENT_MESAFE,
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
        console.log(response,"loginACC")
        console.log(response.data.result.customerId.toString())
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




export function changePasswordFromForgot(newPassword: string,code : string,email:string) {
  return (dispatch: Dispatch<Action>) => {


    dispatch(loadingChangePasswordFromForgot(true));

    axios
      .post(WATER_UPDATE_PASSWORD_FORGOT, 
        {
          newPassword: newPassword,
          code: code,
          email: email
        }
      )
      .then(response => {
        console.log(response)
        if (response.data.isSuccess) {
          dispatch(loadingChangePasswordFromForgot(false));

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
          dispatch(loadingChangePasswordFromForgot(false));
        }}
      )
      .catch(err => {
        dispatch(loadingChangePasswordFromForgot(false));
      });
  };
}

export function getUserAgreement() {
  return (dispatch: Dispatch<Action>) => {

    dispatch(loadingUserAgreement(true));

    axios
      .get(WATER_GET_USER_TERM +`?storeId=${BasestoreId}`)
      .then(response => {
        if (response.data.isSuccess) {

          dispatch(UsergetAgreement(response.data.result))

        } else {

          showSimpleMessage("Bir hata meydana geldi.","danger")
          dispatch(loadingUserAgreement(false));
          }
        }
      )
      .catch(err => {
        console.log(err)
        showSimpleMessage("Bir hata meydana geldi.","danger")
        dispatch(loadingUserAgreement(false));
      });
  };
}


export function getUserAgreementMesafe() {
  return (dispatch: Dispatch<Action>) => {

    dispatch(loadingUserAgreementMesafe(true));

    axios
      .get(WATER_GET_USER_TERM +`?storeId=${BasestoreId}&type=mesafe`)
      .then(response => {
        if (response.data.isSuccess) {

          dispatch(UsergetAgreementMesafe(response.data.result))

        } else {

          showSimpleMessage("Bir hata meydana geldi.","danger")
          dispatch(loadingUserAgreementMesafe(false));
          }
        }
      )
      .catch(err => {
        console.log(err)
        showSimpleMessage("Bir hata meydana geldi.","danger")
        dispatch(loadingUserAgreementMesafe(false));
      });
  };
}

export function getUserAgreementIptal() {
  return (dispatch: Dispatch<Action>) => {

    dispatch(loadingUserAgreementIptal(true));

    axios
      .get(WATER_GET_USER_TERM +`?storeId=${BasestoreId}&type=iptal`)
      .then(response => {
        if (response.data.isSuccess) {

          dispatch(UsergetAgreementIptal(response.data.result))

        } else {

          showSimpleMessage("Bir hata meydana geldi.","danger")
          dispatch(loadingUserAgreementIptal(false));
          }
        }
      )
      .catch(err => {
        console.log(err)
        showSimpleMessage("Bir hata meydana geldi.","danger")
        dispatch(loadingUserAgreementIptal(false));
      });
  };
}



export function forgotPassword(email:string) {
  return (dispatch: Dispatch<Action>) => {
    console.log("girdi")

    dispatch(loadingForgotPassword(true));

    axios
      .get(WATER_USER_FORGOT_PASSWORD +`?email=${email}&storeId=${BasestoreId}`)
      .then(response => {
        if (response.data.isSuccess) {
          dispatch(loadingForgotPassword(false));
          let data = response.data.result
          NavigationService.navigate('CompareCode',{code: data,email:email})
        } else {
          if(response.data.message === "ForgetPassword.EmailNotFound")
          showSimpleMessage("Sisteme kayıtlı böyle bir email bulunamadı.","danger")
          dispatch(loadingForgotPassword(false));
          }
        }
      )
      .catch(err => {
        console.log(err)
        dispatch(loadingForgotPassword(false));
      });
  };
}

export function appKilled() {
  return (dispatch: Dispatch<Action>) => {
    dispatch(appKilledAction());
  }
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


export const loadingForgotPassword = (loader: boolean) => ({
  type: LOADING_FORGOT_PASSWORD,
  payload: loader,
});

export const loadingUserAgreement = (loader: boolean) => ({
  type: LOADING_USER_AGREEMENT,
  payload: loader,
});

export const loadingUserAgreementMesafe = (loader: boolean) => ({
  type: LOADING_USER_AGREEMENT_MESAFE,
  payload: loader,
});

export const UsergetAgreement = (value : string) => ({
  type: GET_USER_AGREEMENT,
  payload: value,
});

export const UsergetAgreementMesafe = (value : string) => ({
  type: GET_USER_AGREEMENT_MESAFE,
  payload: value,
});

export const loadingUserAgreementIptal= (loader: boolean) => ({
  type: LOADING_USER_AGREEMENT_IPTAL,
  payload: loader,
});

export const UsergetAgreementIptal = (value : string) => ({
  type: GET_USER_AGREEMENT_IPTAL,
  payload: value,
});


export const loadingChangePasswordFromForgot =(loader: boolean) => ({
  type: LOADING_FORGOT_PASSWORD_CHANGE,
  payload: loader,
});


export const logout = () => ({
  type: LOGOUT,
  payload: "",
});

export const appKilledAction = () => ({
  type: APP_KILLED,
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
