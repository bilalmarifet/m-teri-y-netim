import {AddCash, Action} from '../states';
import {
  ADD_CASH_SUCCEED,
  ADD_CASH_FAILED,
  RESET_PROPS,
  RESET_CART,
} from '../types';
import {IProductItem} from '../models/productModel';
import {
  LOADING_GET_PRODUCTS_FOR_CUSTOMER,
  GET_PRODUCTS_FOR_CUSTOMER,
  INC_OR_DEC_FROM_CART,
  LOADING_INC_OR_DEC_FROM_CART, CAMPAIGN_LIST_GET, FILTERED_PRODUCT_LIST_GET
} from '../typesCustomer';
import {number} from 'yup';
import {ICampaignItem, IProductItemCustomer} from '../actionsCustomer/ProductAction';

const initalState = {
filteredProductList: []
};

interface State {
filteredProductList: IProductItemCustomer[];

}
export default (state: State = initalState, action: Action) => {
  switch (action.type) {
    case FILTERED_PRODUCT_LIST_GET:
      return {
        ...state,
        filteredProductList: action.payload,
      };
    
    default:
      return state;
  }
};
