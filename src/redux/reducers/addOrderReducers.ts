import { AddOrder, Action } from "../states";
import {ADD_ORDER_SUCCEED,ADD_ORDER_FAILED, RESET_PROPS, ADD_ORDER_IS_LOADING, GET_EMPLOYEE_TOKENS, GET_LAST_ORDER_SUCCEED, PAYMENT_METHODS_LOADING, GET_PAYMENT_METHODS, CHANGE_PAYMENT_METHODS} from "../types";
import { notificationEmployee, lastOrderInterface } from "../actions/addOrderAction";


const initalState = {
    isSuccess: false,
    AddOrderMessage: "",
    isTried : false,
    isLoading : false,
    notificationEmployee : {} as notificationEmployee,
    lastOrder : {} as lastOrderInterface,
    isLoadingGetPaymentMethods: false,
    paymentMethods: [],
    selectedPaymentMethodsIndex: 0
  };

export default (state: AddOrder = initalState, action: Action) => {
  switch (action.type) {
    case CHANGE_PAYMENT_METHODS:
      return {
        ...state,
        selectedPaymentMethodsIndex: action.payload
      }
    case PAYMENT_METHODS_LOADING:
      return {
        ...state,
        isLoadingGetPaymentMethods:action.payload
      }
    case GET_PAYMENT_METHODS:
      return {
        ...state,
        paymentMethods: action.payload
      }
    case ADD_ORDER_SUCCEED:    
      return {
        ...state,
        AddOrderMessage:action.payload,
        isSuccess:true,
        isTried : true,
        isLoading : false
      };
      case ADD_ORDER_FAILED:     
      return {
        ...state,
        AddOrderMessage:action.payload,
        isSuccess:false,
        isTried : true,
          isLoading : false
      };
      case ADD_ORDER_IS_LOADING : 
      return {
        ...state,
        isLoading : action.payload
      }
      case RESET_PROPS : 
      return {
        ...state,
        isSuccess:false,
        AddOrderMessage:"",
        isTried : false,
        isLoading : false
      }
      case GET_EMPLOYEE_TOKENS:
        return {
          ...state,
          notificationEmployee : action.payload
        }
      case GET_LAST_ORDER_SUCCEED:
        return {
          ...state,
          lastOrder : action.payload
        }
    default:
      return state;
  }
};