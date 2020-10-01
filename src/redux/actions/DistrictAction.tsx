import axios from 'axios'
import {WATER_CUSTOMER_ORDER_DELETE, WATER_GET_DISTRICT} from './../constants'
import { Dispatch } from "react";
import {ORDER_DELETE_SUCCEED,ORDER_DELETE_FAILED, GET_DISTRICT, LOADING_GET_DISTRICT, LOADING_ADD_DISTRICT, LOADING_REMOVE_DISTRICT} from './../types'
import {Action} from '../states'
import {AsyncStorage } from 'react-native'

import { showSimpleMessage } from '../../components/showMessage';
import { BasestoreId } from '../../services/AppConfig';



export interface District {
    storeId: number;
    districtName: string;
    createdDate: Date;
    id: number;
}



export function getDistrict() {
  return (dispatch : any) =>  {
    dispatch(loading(true))
    AsyncStorage.getItem('userToken').then((res) => {
      let token = res;


    axios.get(WATER_GET_DISTRICT+ `?storeId=${BasestoreId}`)
    .then((response) =>{
      console.log(response)
    if(response.data.isSuccess){
        if(response.data.result){
          console.log(response.data.result)
            var list : District[] = []
           response.data.result.forEach((element:District) => {
            list.push({
                storeId : element.storeId,
                districtName : element.districtName,
                createdDate: element.createdDate,
                id : element.id
            })
            
           });
           dispatch(DistrictGet(list))
           dispatch(loading(false))
        }
        else {
          dispatch(loading(false))
        }
      }else {
        dispatch(loading(false))
        showSimpleMessage("Mahalleler listelenirken bir hata meydana geldi lütfen daha sonra tekrar deneyiniz.","danger")
          
      }
    })
    .catch(error => { 
      console.log(error)
        dispatch(loading(false))
        showSimpleMessage("Mahalleler listelenirken bir hata meydana geldi lütfen daha sonra tekrar deneyiniz.","danger")
    });

  }).catch((res) => {
    dispatch(loading(false))
    showSimpleMessage("Mahalleler listelenirken bir hata meydana geldi lütfen daha sonra tekrar deneyiniz.","danger")
  })

  

  }

}

 const loading =(bool:boolean) => ({
     type: LOADING_GET_DISTRICT,
     payload:bool
 })

  export const DistrictGet = (list: District[]) => ({
    type : GET_DISTRICT,
    payload : list
  })
  
