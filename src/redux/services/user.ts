import {AsyncStorage } from 'react-native'

import axios from 'axios';
import {WATER_USER_LOGIN } from '../constants'
import { user } from '../actions/getUserAction';

export function fetchImageService(page?: number, limit?: number) {
  return new Promise((resolve, reject) => {
    fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`)
      .then(res => {
        return res.json();
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function loginUserService(username: string, password: string) {
  console.log(username,password)
  return axios.post(WATER_USER_LOGIN, {
    username: username,
    password: password
  })
  .then((response) =>{
  if(response.data.isSuccess){
  }
  console.log(response,"response")
  })
  .catch((err) => {
 console.error(err);
  });

}

export function logoutUserService() {
  return new Promise((resolve, reject) => {
    AsyncStorage.removeItem("userToken")
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}
