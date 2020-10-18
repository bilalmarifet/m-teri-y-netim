import { AsyncStorage } from "react-native";
import { WATER_ADRESS, WATER_CUSTOMER_ADD_NEW } from "../constants";
import { ADRESS_ADD_LOADING, ADRESS_CHANGE_SELECTED_ID, ADRESS_EDIT_LOADING, ADRESS_GET, ADRESS_GET_LOADING, CUSTOMER_ADD_LOADING } from "../types";
import axios from 'axios'
import { showSimpleMessage } from "../../components/showMessage";
import NavigationService from "../../services/NavigationService";

export interface adress {

    customerId: number;
    addressInfo: string;
    createdDate: Date;
    title: string;
    active: boolean;
    id: number;
      
}

export function editAdress(addressId:number,addressInfo:string,title:string) {
    return async (dispatch: any) => {
  
        dispatch(adressEditLoading(true))
    
        AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
          let token = res[0][1];
          let userId = res[1][1];
    
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        let customerId = Number(global.CUSTOMER_ID)
          axios.put(WATER_ADRESS + `?addressId=${addressId}`,{
            customerId: customerId,
            addressInfo: addressInfo,
            title: title
          },{ headers: headers })
            .then((response) => {
              if (response.data.isSuccess) {
                dispatch(adressEditLoading(false))
                showSimpleMessage("Adres Başarıyla güncellendi.","success")
                dispatch(getAdress())
                NavigationService.navigate('MyAdresses')
              }
              else {
                showSimpleMessage("Adres güncellenemedi daha sonra tekrar deneyiniz.","danger")
                dispatch(adressEditLoading(false))
              }
            })
            .catch(error => {
                showSimpleMessage("Adres güncellenemedi daha sonra tekrar deneyiniz.","danger")
                
                dispatch(adressEditLoading(false))
            });
      
        })
    
    
      }

}

export function addAdress(addressInfo:string,title:string) {
    return async (dispatch: any) => {
  
        dispatch(adressAddLoading(true))
    
        AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
          let token = res[0][1];
          let userId = res[1][1];
    
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        let customerId = Number(global.CUSTOMER_ID)
          axios.post(WATER_ADRESS,{
            customerId: customerId,
            addressInfo: addressInfo,
            title: title
          },{ headers: headers })
            .then((response) => {
              if (response.data.isSuccess) {
                dispatch(adressAddLoading(false))
                showSimpleMessage("Adres Başarıyla eklendi.","success")
                dispatch(getAdress())
                NavigationService.navigate('MyAdresses')
              }
              else {
                showSimpleMessage("Adres eklenemedi daha sonra tekrar deneyiniz.","danger")
                dispatch(adressAddLoading(false))
              }
            })
            .catch(error => {
                showSimpleMessage("Adres eklenemedi daha sonra tekrar deneyiniz.","danger")
                
                dispatch(adressAddLoading(false))
            });
      
        })
    
    
      }

}

export function changeSelectedAdressId(adressId: number) {
  
  
  
  return async (dispatch: any) => {

    dispatch(changeAdressId(adressId))
  }

}

export function getAdress() {
  
  
  
    return async (dispatch: any) => {
  
      dispatch(adressGetIsLoading(true))
  
      AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
        let token = res[0][1];
        let userId = res[1][1];
  
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
  
        axios.get(WATER_ADRESS + `?customerId=${global.CUSTOMER_ID}`,{ headers: headers })
          .then((response) => {
            if (response.data.isSuccess) {
                let adressList: adress[] = []
              if (response.data.result) {
                adressList = response.data.result
                dispatch(adressGet(adressList))
              }
              dispatch(adressGet(adressList))
            }
            else {
            dispatch(adressGetIsLoading(false))
            }
          })
          .catch(error => {
  
            dispatch(adressGetIsLoading(false))
          });
    
      })
  
  
    }
  
  }

  export const changeAdressId = (adressId: number) => ({
    type: ADRESS_CHANGE_SELECTED_ID,
    payload: adressId
  })

  export const adressGetIsLoading = (loading: boolean) => ({
    type: ADRESS_GET_LOADING,
    payload: loading
  })
  
  
  export const adressGet = (adressList: adress[]) => ({
    type: ADRESS_GET,
    payload: adressList
  })
  

  export const adressAddLoading = (loading: boolean) => ({
    type: ADRESS_ADD_LOADING,
    payload: loading
  })
  export const adressEditLoading = (loading: boolean) => ({
    type: ADRESS_EDIT_LOADING,
    payload: loading
  })
  
  
  