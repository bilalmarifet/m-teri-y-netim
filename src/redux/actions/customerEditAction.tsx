import axios from 'axios'
import {WATER_CUSTOMER_EDIT, WATER_CUSTOMER_GETBY_ID, WATER_CUSTOMER_UPDATE_PASSWORD} from './../constants'

import {CUSTOMER_EDIT_FAILED,CUSTOMER_EDIT_SUCCEED, CUSTOMER_EDIT_LOADING, CUSTOMER_GETBY_ID_LOADING, CUSTOMER_GETBY_ID, CUSTOMER_UPDATE_PASSWORD_LOADING} from './../types'
import {Action} from '../states'
import Axios from 'axios';
import {AsyncStorage } from 'react-native'

import { reset } from './loginAction';
import { GetCustomers } from './homeAction';
import { UserInfo, getUserInfo } from './profileActions';
import { showSimpleMessage } from '../../components/showMessage';
import { bool } from 'yup';
import { Dispatch } from 'redux';



export interface Customer {
  customerId: number;
  nameSurname: string;
  companyName: string;
  phoneNumber: string;
  address: string;
  fountainCount: string;
  dayOfWeeks: string;
  carboyCount : number;
  description : string;
}


export function getCustomerInfo(customerId : number) {
  return (dispatch : Dispatch<Action>) => {
    dispatch(getCustomerLoading(true))

    AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
      let token = res[0][1];
      let userId = res[1][1];
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    var customer = {} as Customer;

    axios.get(WATER_CUSTOMER_GETBY_ID + `?customerId=${customerId}`,{
      headers : headers
     }) .then((response) =>{
      if(response.data.isSuccess){
        console.log(response)
          let data = response.data.result.getCustomerByIdResponseModels[0]
          customer.address = data.address
          customer.companyName = data.companyName
          customer.customerId = data.customerId
          customer.dayOfWeeks = data.dayOfWeeks
          customer.fountainCount = data.fountainCount
          customer.nameSurname = data.nameSurname
          customer.phoneNumber = data.phoneNumber
          customer.description = data.description
          customer.carboyCount = data.carboyCount
          dispatch(getCustomer(customer))
          dispatch(getCustomerLoading(false))
        }
      })
      .catch(error => {      

        dispatch(getCustomerLoading(false))
      });

  }).catch(err => {
    dispatch(getCustomerLoading(false))
  })

  }
}



export function customerUpdatePassword(oldPassword:string,newPassword:string) {
  return(dispatch:any) => {
    dispatch(customerUpdatePasswordLoading(true))
    AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
      let token = res[0][1];
      let userId = res[1][1];

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    axios.post(WATER_CUSTOMER_UPDATE_PASSWORD,
      {
          oldPassword: oldPassword,
          newPassword: newPassword,
          userId: global.USERID
      },{
        headers: headers
      })
    .then((response) =>{
      console.log(response)
    if(response.data.isSuccess){
        if(response.data.result){
          showSimpleMessage("Bilgileriniz Güncellendi.","success")
          dispatch(customerUpdatePasswordLoading(false))
        }
      }
      else {
        if(response.data.message === "Post.UpdatePassword.OldPasswordDidNotMatch")
          {
            showSimpleMessage("Mevcut şifrenizi yanlış girdiniz. Lütfen tekrar deneyiniz.","danger")
          }
else {
  showSimpleMessage("Bilgileriniz Güncellenemedi. Lütfen sonra tekrar deneyiniz.","danger")
}
        
          dispatch(customerUpdatePasswordLoading(false))
      }
    })
    .catch(error => {      
      console.log(error) 
      showSimpleMessage("Bilgileriniz Güncellenemedi. Lütfen sonra tekrar deneyiniz.","danger")
      dispatch(customerUpdatePasswordLoading(false))

    });


  }).catch(err=> {
    console.log(err)
    showSimpleMessage("Bilgileriniz Güncellenemedi. Lütfen sonra tekrar deneyiniz.","danger")
    dispatch(customerUpdatePasswordLoading(false))
  })
 
  }
}
export function customerEdit(user:UserInfo) {
  return (dispatch :any) =>  {
    dispatch(customerEditLoading(true))
    AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
      let token = res[0][1];
      let userId = res[1][1];

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    console.log(user,global.CUSTOMER_ID,userId)
    axios.post(WATER_CUSTOMER_EDIT,
      {
          id: global.CUSTOMER_ID,
          nameSurname: user.nameSurname,
          companyName: user.companyName,
          dayOfWeek :0,
          fountainCount:user.fountainCount,
          dayOfWeeks: user.dayOfWeeks,
          userId : Number(userId),
          address: user.address,
          phoneNumber :user.phoneNumber,
          carboyCount: user.carboyCount,
          description: user.description,
          email:user.email,
      },{
        headers: headers
      })
    .then((response) =>{
      console.log(response)
    if(response.data.isSuccess){
        if(response.data.result){
          showSimpleMessage("Bilgileriniz Güncellendi.","success")
          dispatch(getUserInfo())
          dispatch(customerEditLoading(false))
        }
      }
      else {
        if(response.data.message === "Customer.Update.EmailFound") {
          showSimpleMessage("Bu email zaten kayıtlı. Lütfen başka bir email deneyiniz.","danger")
        } else {
          showSimpleMessage("Bilgileriniz Güncellenemedi. Lütfen sonra tekrar deneyiniz.","danger")
        }
        
        dispatch(customerEditLoading(false))
      }
    })
    .catch(error => {      
      console.log(error) 
      showSimpleMessage("Bilgileriniz Güncellenemedi. Lütfen sonra tekrar deneyiniz.","danger")
      dispatch(customerEditLoading(false))

    });


  }).catch(err=> {
    console.log(err)
    showSimpleMessage("Bilgileriniz Güncellenemedi. Lütfen sonra tekrar deneyiniz.","danger")
    dispatch(customerEditLoading(false))
  })
 
  }
}

  
  export const customerEditIsSucceed = (isSuccess : boolean, message:string) => ({
    type : isSuccess ? CUSTOMER_EDIT_SUCCEED : CUSTOMER_EDIT_FAILED,
    payload : message
  })
  

  export const getCustomer = (customer : Customer) => ({
    type : CUSTOMER_GETBY_ID,
    payload : customer
  })


  export const getCustomerLoading  = (bool : boolean) => ({
    type : CUSTOMER_GETBY_ID_LOADING,
    payload : bool
  })


  export const customerEditLoading = (bool: boolean) => ({
    type: CUSTOMER_EDIT_LOADING,
    payload: bool
  })

  export const customerUpdatePasswordLoading = (bool: boolean) => ({
    type: CUSTOMER_UPDATE_PASSWORD_LOADING,
    payload: bool
  })


// CUSTOMER_EDIT_LOADING



