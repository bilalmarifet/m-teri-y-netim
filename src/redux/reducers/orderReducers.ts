import {IMAGE_DATA_FETCHED, DATA_LOADING, FETCH_MORE} from '../actions/fetch';
import {Orders, Action} from '../states';
import {
  ORDERS_GET,
  ORDER_LOADING,
  GET_REST_TOTAL_AMOUNT,
  GET_TAKE_TOTAL_AMOUNT,
  GET_TOOK_TOTAL_AMOUNT,
  ORDERS_GET_MORE,
  ORDER_LOADING_MORE,
  CUSTOMER_DETAIL,
  CUSTOMER_DETAIL_LOADING,
  RESET_PROPS,
  DO_BULK_PAYMENT_FAILED,
  DO_BULK_PAYMENT_SUCCEED,
  DO_BULK_PAYMENT_LOADING,
} from '../types';
import {act} from 'react-test-renderer';
import customer from '../../pages/customer';
import {ICustomerDetailItem} from '../models/homeModel';

const initalState = {
  orders: [],
  isOrderLoading: false || null,
  loadingMore: false,
  customerDetail: {} as ICustomerDetailItem,
  isCustomerDetailLoading: false,
  loadingDoBulkPayment: false,
  messageDoBulkPaymnet: '',
  isSucceedDOBulkPayment: false,
};

export default (state: Orders = initalState, action: Action) => {
  switch (action.type) {
    case ORDERS_GET:
      return {
        ...state,
        orders: action.payload,
        isOrderLoading: false,
      };
    case DO_BULK_PAYMENT_SUCCEED:
      return {
        ...state,
        isSucceedDOBulkPayment: true,
        messageDoBulkPaymnet: action.payload,
      };
    case DO_BULK_PAYMENT_LOADING:
      return {
        ...state,
        loadingDoBulkPayment: true,
      };
    case DO_BULK_PAYMENT_FAILED:
      return {
        ...state,
        loadingDoBulkPayment: false,
        messageDoBulkPaymnet: action.payload,
      };
    case RESET_PROPS:
      return {
        ...state,
        loadingDoBulkPayment: false,
        messageDoBulkPaymnet: '',
        isSucceedDOBulkPayment: false,
      };
    case ORDERS_GET_MORE:
      return {
        ...state,

        orders: [...state.orders, ...action.payload],
        loadingMore: false,
        isOrderLoading: false,
      };
    case GET_TAKE_TOTAL_AMOUNT:
      return {
        ...state,
        takeTotalAmount: action.payload,
        isOrderLoading: false,
      };
    case GET_TOOK_TOTAL_AMOUNT:
      return {
        ...state,
        tookTotalAmount: action.payload,
        isOrderLoading: false,
      };
    case GET_REST_TOTAL_AMOUNT:
      return {
        ...state,
        restTotalAmount: action.payload,
        isOrderLoading: false,
      };
    case ORDER_LOADING:
      return {
        ...state,
        customerId: action.payload,
        isOrderLoading: action.payload,
      };
    case ORDER_LOADING_MORE:
      return {
        ...state,
        customerId: action.payload,
        loadingMore: action.payload,
      };
    case CUSTOMER_DETAIL:
      return {
        ...state,
        customerDetail: action.payload,
        isCustomerDetailLoading: false,
      };
    case CUSTOMER_DETAIL_LOADING:
      return {
        ...state,
        isCustomerDetailLoading: true,
      };
    default:
      return state;
  }
};