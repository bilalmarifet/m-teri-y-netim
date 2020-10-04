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
  LOADING_INC_OR_DEC_FROM_CART, CAMPAIGN_LIST_GET
} from '../typesCustomer';
import {number} from 'yup';
import {ICampaignItem, IProductItemCustomer} from '../actionsCustomer/ProductAction';

const initalState = {
  loading: false,
  productList: [],
  loadingIncDec: false,
  loadingIndex: 0,
  campaings:[]
};

interface State {
  productList: IProductItemCustomer[];
  loading: boolean;
  loadingIncDec: boolean;
  loadingIndex: number;
  campaings:ICampaignItem[];
}
export default (state: State = initalState, action: Action) => {
  switch (action.type) {
    case LOADING_GET_PRODUCTS_FOR_CUSTOMER:
      return {
        ...state,
        loading: action.payload,
      };
    case GET_PRODUCTS_FOR_CUSTOMER:
      return {
        ...state,
        loading: false,
        productList: action.payload,
      };
    case INC_OR_DEC_FROM_CART:
      return {
        ...state,
        productList: action.payload,
        loadingIndex: 0,
        loadingIncDec: false,
      };

    case LOADING_INC_OR_DEC_FROM_CART:
      return {
        ...state,
        loadingIndex: action.payload[1],
        loadingIncDec: action.payload[0],
      };
    case RESET_CART:
      return {
        ...state,
        productList: state.productList.map(e =>
          e.count !== 0 ? {...e, count: 0} : e,
        ),
      };

      case CAMPAIGN_LIST_GET:
        console.log(action.payload, "reducers");
        return {
          ...state,
          campaings:action.payload
        };
    default:
      return state;
  }
};
