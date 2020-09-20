import axios from 'axios';
import {WATER_GET_PRODUCT} from './../constants';
import {Dispatch} from 'react';
import {PRODUCT_GET, PRODUCT_LOADING} from './../types';
import {Action} from '../states';
import {IProductItem} from '../models/productModel';
import {AsyncStorage} from 'react-native';
import {
  LOADING_GET_PRODUCTS_FOR_CUSTOMER,
  GET_PRODUCTS_FOR_CUSTOMER,
  INC_OR_DEC_FROM_CART,
  LOADING_INC_OR_DEC_FROM_CART,
} from '../typesCustomer';

export interface IProductItemCustomer extends IProductItem {
  count: number;
}
export function GetProductsForCustomer(productsList?: IProductItemCustomer[]) {
  return (dispatch: Dispatch<Action>) => {
    dispatch(loading(true));
    console.log("owner id",global.STORE_OWNER_USER_ID);

    AsyncStorage.multiGet(['userToken', 'userId'])
      .then(res => {
        let token = res[0][1];
        let userId = res[1][1];

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        axios
          .get(
            WATER_GET_PRODUCT + '?userId=' + global.STORE_OWNER_USER_ID,

            {headers: headers},
          )
          .then(response => {
            if (response.data.isSuccess) {
              var productModel: IProductItemCustomer[] = [];

              response.data.result.homeProductItemModels.forEach(
                (product: any) => {
                  let index = productsList.findIndex(
                    e => e.productId === product.productId,
                  );
                  let count = index !== -1 ? productsList[index].count : 0;
                  var productItem: IProductItemCustomer = {
                    productId: product.productId,
                    productName: product.productName,
                    productCode: product.productCode,
                    price: product.price,
                    productStatus: product.productStatus,
                    count: count,
                  };
                  productModel.push(productItem);
                },
              );

              dispatch(products(productModel));
              dispatch(loading(false));
            } else {
              dispatch(loading(false));
            }
          })
          .catch(err => {
            dispatch(loading(false));
          });
      })
      .catch(err => {
        console.log(err);
        dispatch(loading(false));
      });
  };
}

export function IncOrDecItemFromCart(
  productsList: IProductItemCustomer[],
  productId: number,
  isIncrease: boolean,
  index?: number,
) {
  return (dispatch: Dispatch<Action>) => {
    var list = [];
    dispatch(loadingForIncDec(true, productId));
    if (index) {
      let count = productsList[index].count;
      list = [
        ...productsList.slice(0, index),
        {
          ...{
            ...productsList[index],
            count: isIncrease ? count + 1 : count - 1,
          },
        },
        ...productsList.slice(index + 1),
      ];
    } else {
      list = productsList.map(e =>
        e.productId === productId
          ? {...e, count: isIncrease ? e.count + 1 : e.count - 1}
          : e,
      );
    }

    dispatch(incOrDecPrice(list));
  };
}

export const incOrDecPrice = (productList: IProductItemCustomer[]) => ({
  type: INC_OR_DEC_FROM_CART,
  payload: productList,
});

export const loading = (loader: boolean) => ({
  type: LOADING_GET_PRODUCTS_FOR_CUSTOMER,
  payload: loader,
});

export const products = (products: IProductItem[]) => ({
  type: GET_PRODUCTS_FOR_CUSTOMER,
  payload: products,
});

export const loadingForIncDec = (loading: boolean, index: number) => ({
  type: LOADING_INC_OR_DEC_FROM_CART,
  payload: [loading, index],
});
