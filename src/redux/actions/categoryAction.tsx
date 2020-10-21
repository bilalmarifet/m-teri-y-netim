import { AsyncStorage } from "react-native";
import { WATER_ADRESS, WATER_CUSTOMER_ADD_NEW, WATER_GET_CATEGORIES } from "../constants";
import { ADRESS_ADD_LOADING, ADRESS_CHANGE_SELECTED_ID, ADRESS_EDIT_LOADING, ADRESS_GET, ADRESS_GET_LOADING, CUSTOMER_ADD_LOADING, GET_CATEGORIES_LIST, GET_CATEGORIES_LOADING } from "../types";
import axios from 'axios'
import { showSimpleMessage } from "../../components/showMessage";
import NavigationService from "../../services/NavigationService";
import { BasestoreId } from "../../services/AppConfig";

export interface Category {
    categoryParentId: number;
    storeId: number;
    name: String;
    photoPath: String;
    createdDate:Date;
    active: boolean;
    id: number;
      
}

export function getCategories() {
    return async (dispatch: any) => {
  
        dispatch(getCategoriesLoading(true))
    
        AsyncStorage.multiGet(['userToken', 'userId']).then((res) => {
          let token = res[0][1];
          let userId = res[1][1];
    
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
          axios.get(WATER_GET_CATEGORIES + `?storeId=${BasestoreId}`,{ headers: headers })
            .then((response) => {
              if (response.data.isSuccess) {
                var categoriList: Category[] = []
                if(response.data.result && response.data.result.length > 0 ) {
                    response.data.result.forEach((element:Category) => {
                        categoriList.push(element) 
                    });
                    dispatch(getCategoriesList(categoriList))

                }else {
                    dispatch(getCategoriesList([]))

                }
              }
              else {
                dispatch(getCategoriesLoading(false))
              }
            })
            .catch(error => {
                
                dispatch(getCategoriesLoading(false))
            });
      
        })
    
    
      }

}

  
  export const getCategoriesLoading= (loading: boolean) => ({
    type: GET_CATEGORIES_LOADING,
    payload: loading
  })


  export const getCategoriesList = (value: Category[]) => ({
    type: GET_CATEGORIES_LIST,
    payload: value
  })
  
  
  