import {AsyncStorage} from 'react-native';

import axios from 'axios';
import {
  WATER_USER_CREATE_CONTROL_EMAIL,
  WATER_USER_CREATE,
  WATER_USER_CREATE_EMAIL_CONTROL,
  WATER_CONTROL_PHONE_NUMBER,
} from './../constants';
import {Dispatch} from 'react';
import {
  SIGNUP_FAILED,
  SIGNUP_STARTED,
  SIGNUP_SUCCEED,
  RESET_PROPS,
  USER_CREATE_FIRST_STEP,
  SIGNUP2_SUCCEED,
  SIGNUP2_FAILED,
  SIGNUP2_STARTED,
} from './../types';
import {Action} from '../states';
import {UserFirstData} from '../reducers/signUpReducers';
import {navigate} from '../services/Navigator';
import NavigationService from '../../services/NavigationService';
import { showSimpleMessage } from '../../components/showMessage';
import { BasestoreId, BaseStoreOwnerUserId } from '../../services/AppConfig';
import { User } from './createUserAction';

export interface BaseUser {
  nameSurname: string;
  phoneNumber: string;
  email: string;
  password: string;
  companyName: string;
  address: string;
  userType: number;
  storeId: number;
  storeOwnerUserId: number;
}


export function createUserControlIfNumberIsUsed(user: BaseUser,isLogin: boolean) {
  return (dispatch: Dispatch<any>) => {
    dispatch(loadingSecond(true));
    axios
    .get(WATER_CONTROL_PHONE_NUMBER + `?userId=${BaseStoreOwnerUserId}&phoneNumber=${user.phoneNumber}`).then(res => {
      console.log(res,"responsee")
      if (res.data.result && res.data.result.authUserResult && res.data.result.authUserResult.token) {
        let data = res.data.result.authUserResult
        if(isLogin) {

        }else {
          showSimpleMessage("Böyle bir kullanıcı var giriş yapılıyor.","success")
        }
        AsyncStorage.multiSet([
          ['UserType', user.userType.toString()],
          ['storeOwnerUserId', BaseStoreOwnerUserId.toString()],
          ['customerId', data.customerId.toString()],
          ['userId',data.userId.toString()],
          ['userToken',data.token.toString()]
        ]).then(() => {
          dispatch(loginIsSucceedSecond(true, ''));
          dispatch(reset());
          NavigationService.navigate("AuthLoading")
        });
         
          dispatch(reset());
        } else {
          dispatch(reset());
          if(isLogin) {
            showSimpleMessage("Böyle bir kullanıcı bulunamadı.","danger")
          }else {
            dispatch(createBaseUser(user))
          }
      }
    })
    .catch(err => {
      console.log(err)
      dispatch(loginIsSucceedSecond(false, 'Bir Hata Meydana Geldi'));
      dispatch(reset());
    });
}
}
export function createBaseUser(user: BaseUser) {
  return (dispatch: Dispatch<Action>) => {
    dispatch(loadingSecond(true));
    console.log(user, WATER_USER_CREATE);
    let storeOwnerUserId = user.storeOwnerUserId
      ? user.storeOwnerUserId.toString()
      : '0';
    console.log(user)
    axios
      .post(WATER_USER_CREATE, {
        nameSurname: user.nameSurname ,
        phoneNumber: user.phoneNumber,
        email: user.email ?? "",
        password: user.password ?? "",
        companyName: user.userType === 3 ? '' : user.companyName ,
        address: user.address ?? "",
        userType: user.userType,
        appToken: '',
        storeId: user.userType === 3 ? user.storeId : 0,
      })
      .then(res => {
        if (res.data.isSuccess) {
          console.log(user);
          console.log(res.data.result);
          AsyncStorage.setItem('userToken', res.data.result.token)
            .then(() => {
              AsyncStorage.setItem('userId', res.data.result.userId.toString())
                .then(() => {
                  AsyncStorage.multiSet([
                    ['UserType', user.userType.toString()],
                    ['storeOwnerUserId', storeOwnerUserId],
                    ['customerId', res.data.result.customerId.toString()],
                  ]).then(() => {
                    dispatch(loginIsSucceedSecond(true, ''));
                    dispatch(reset());
                    NavigationService.navigate("AuthLoading")
                  });
                })
                .catch(er => {
                  dispatch(
                    loginIsSucceedSecond(false, 'Bir Hata Meydana Geldi'),
                  );
                  dispatch(reset());
                });
            })
            .catch(err => {
              dispatch(loginIsSucceedSecond(false, 'Bir Hata Meydana Geldi'));
              dispatch(reset());
            });
        } else {
          dispatch(loginIsSucceedSecond(false, 'Bir Hata Meydana Geldi'));
          dispatch(reset());
        }
      })
      .catch(err => {
        dispatch(loginIsSucceedSecond(false, 'Bir Hata Meydana Geldi'));
        dispatch(reset());
        console.log(err);
      });
  };
}
export function controlEmail(
  NameSurname: string,
  password: string,
  email: string,
) {
  return (dispatch: Dispatch<Action>) => {
    var user = {} as UserFirstData;
    user.NameSurname = NameSurname;
    user.email = email;
    user.password = password;

    dispatch(loading(true));

    axios
      .post(WATER_USER_CREATE_EMAIL_CONTROL, {
        email: email,
        storeId: BasestoreId
      })
      .then(res => {
        console.log(res)
        if (res.data.result) {
          dispatch(signUpFirstSucceed(user));
          dispatch(loginIsSucceed(true, ''));
          dispatch(reset());
        } else {
          if (res.data.message === 'Error.User.EmailCheck.EmailFound') {
              showSimpleMessage('Bu email adresi ile tanımlı kullanıcı bulundu. Şifrenizi unuttuysanız yeni şifre alabilirsiniz.',"danger")
            dispatch(reset());
          } else {
            showSimpleMessage( 'Bir Hata meydana geldi.',"danger")
            dispatch(reset());
          }
        }
      })
      .catch(err => {
        showSimpleMessage( 'Bir Hata meydana geldi.',"danger")
        dispatch(reset());
      });

  };
}

export const loading = (loader: boolean) => ({
  type: SIGNUP_STARTED,
  payload: loader,
});
export const loadingSecond = (loader: boolean) => ({
  type: SIGNUP2_STARTED,
  payload: loader,
});

export const loginIsSucceed = (loginIsSucced: boolean, message: string) => ({
  type: loginIsSucced ? SIGNUP_SUCCEED : SIGNUP_FAILED,
  payload: message,
});

export const loginIsSucceedSecond = (
  loginIsSucced: boolean,
  message: string,
) => ({
  type: loginIsSucced ? SIGNUP2_SUCCEED : SIGNUP2_FAILED,
  payload: message,
});

export const signUpFirstSucceed = (user: UserFirstData) => ({
  type: USER_CREATE_FIRST_STEP,
  payload: user,
});

export const reset = () => ({
  type: RESET_PROPS,
  payload: null,
});
