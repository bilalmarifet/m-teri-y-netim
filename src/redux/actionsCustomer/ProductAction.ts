import axios from 'axios';
import { WATER_GET_CAMPAIGN, WATER_GET_PRODUCT, WATER_GET_PRODUCTS_FOR_CUSTOMER } from './../constants';
import { Dispatch } from 'react';
import { PRODUCT_GET, PRODUCT_LOADING } from './../types';
import { Action } from '../states';
import { IProductItem } from '../models/productModel';
import { AsyncStorage } from 'react-native';
import {
  LOADING_GET_PRODUCTS_FOR_CUSTOMER,
  GET_PRODUCTS_FOR_CUSTOMER,
  INC_OR_DEC_FROM_CART,
  LOADING_INC_OR_DEC_FROM_CART, CAMPAIGN_LIST_GET
} from '../typesCustomer';
import { bool, date, string } from 'yup';
import { BasestoreId } from '../../services/AppConfig';
import { Item } from 'native-base';

export interface IProductItemCustomer extends IProductItem {
  count: number;
  active: boolean;
  isCampaign: boolean | null
  newPrice: number;
  productCount: number;
  productCode :string;
  price :number;
  productStatus:boolean;
  photoPath:string;
  categoryId:number;
  categoryName:string;
  categoryParentName: string;
  categoryParentId: string;

}

export interface ICampaignItem {
  storeId: number;
  name: string;
  photoPath: string;
  createdDate: Date;
  activeDate: Date;
  endDate: Date;
  active: boolean;
  campaignDescription: string;
}

export function GetCampaignHome() {
  return (dispatch: Dispatch<Action>) => {
    dispatch(loading(true));


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
            WATER_GET_CAMPAIGN + '?storeId=' + BasestoreId,
            { headers: headers },
          )
          .then(response => {
            if (response.data.isSuccess) {
              var campaignModel: ICampaignItem[] = [];
              console.log(response, "campaigns");
              response.data.result.forEach(
                (campaign: any) => {
                  let campaignItem: ICampaignItem = {
                    active: campaign.active,
                    activeDate: campaign.activeDate,
                    campaignDescription: campaign.campaignDescription,
                    createdDate: campaign.createdDate,
                    endDate: campaign.endDate,
                    name: campaign.name,
                    photoPath: campaign.photoPath,
                    storeId: campaign.storeId
                    
                  }
                  campaignModel.push(campaignItem);
                },
              );

              dispatch(campaigns(campaignModel));
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

        dispatch(loading(false));
      });
  };
}
export function GetProductsForCustomer(productsList?: IProductItemCustomer[] = []) {
  return (dispatch: Dispatch<Action>) => {
    dispatch(loading(true));
    console.log("owner id", global.STORE_OWNER_USER_ID);

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
            WATER_GET_PRODUCTS_FOR_CUSTOMER + `?storeId=${BasestoreId}`,
            { headers: headers },
          )
          .then(response => {
            console.log(response)
            if (response.data.isSuccess) {
              var productModel: IProductItemCustomer[] = [];
              response.data.result.forEach(
                (product: any) => {
                  let index = productsList.findIndex(
                    e => e.id === product.id,
                  );
                  let count = index !== -1 ? productsList[index].count : 0;
                  var productItem: IProductItemCustomer = {
                    id: product.id,
                    productName: product.productName,
                    productCode: product.productCode,
                    price: product.price,
                    productStatus: product.productStatus,
                    count: count,
                    photoPath: product.photoPath ? product.photoPath : "",
                    active: product.active,   
                    newPrice: product.newPrice,
                    productCount: product.productCount,
                    isCampaign: product.isCampaign,
                    categoryId:product.categoryId,
                    categoryName:product.categoryName,
                    categoryParentName: product.categoryParentName,
                    categoryParentId:  product.categoryParentId
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
    console.log(productId)


    if (index) {
      index = productsList.findIndex(e => e.id === productId)
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
        e.id === productId
          ? { ...e, count: isIncrease ? e.count + 1 : e.count - 1 }
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

export const campaigns = (campaignsList: ICampaignItem[]) => ({
  type: CAMPAIGN_LIST_GET,
  payload: campaignsList,
});


export const products = (products: IProductItem[]) => ({
  type: GET_PRODUCTS_FOR_CUSTOMER,
  payload: products,
});

export const loadingForIncDec = (loading: boolean, index: number) => ({
  type: LOADING_INC_OR_DEC_FROM_CART,
  payload: [loading, index],
});
