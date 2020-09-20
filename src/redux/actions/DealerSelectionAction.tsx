import {AsyncStorage} from 'react-native';

import axios from 'axios';
import {WATER_GET_DEALERS_LIST} from './../constants';
import {Dispatch} from 'react';
import {
  CUSTOMERPICE_PRODUCT_GET,
  CUSTOMERPICE_PRODUCT_LOADING,
  LOADING_GET_STORE_LIST,
  GET_STORE_LIST,
} from './../types';
import {Action} from '../states';
import {ICustomerPriceProductItem} from '../models/customerPriceProductModel';

export interface homeStoreItemModels {
  storeId: number;
  userId: number;
  nameSurname: string;
  email: string;
  storeName: string;
  phoneNumber: string;
  address: string;
  active: boolean;
  status: number;
  createdDate: Date;
  updatedDate: Date;
}
export function getDealers() {
  return (dispatch: Dispatch<Action>) => {
    dispatch(loading(true));

    axios
      .get(WATER_GET_DEALERS_LIST)
      .then(response => {
        if (response.data.isSuccess) {
          var storeList: homeStoreItemModels[] = [];

          response.data.result.homeStoreItemModels.forEach(
            (store: homeStoreItemModels) => {
              storeList.push(store);
            },
          );

          dispatch(getStoreList(storeList));
        } else {
          dispatch(loading(false));
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(loading(false));
      });
  };
}

export const loading = (loader: boolean) => ({
  type: LOADING_GET_STORE_LIST,
  payload: loader,
});

export const getStoreList = (storeList: homeStoreItemModels[]) => ({
  type: GET_STORE_LIST,
  payload: storeList,
});
