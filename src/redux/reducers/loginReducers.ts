import { LOGIN_STARTED,LOGIN_FAILED,LOGIN_SUCCEED,RESET_PROPS, LOADING_FORGOT_PASSWORD, LOADING_FORGOT_PASSWORD_CHANGE, LOADING_USER_AGREEMENT, GET_USER_AGREEMENT, LOADING_USER_AGREEMENT_IPTAL, GET_USER_AGREEMENT_IPTAL, LOADING_USER_AGREEMENT_MESAFE, GET_USER_AGREEMENT_MESAFE } from "../types";
import {Action, UserState} from '../states';
import { boolean } from "yup";

const intialState = {
    isLoading : false,
    isFinished : false,
    isSucceed : false,
    loginErrorMessage:"",
    isLoadingForgotPassword: false,
    isLoadingForgotPasswordChange: false,
    loadingForAgreement: false,
    agremeent: "",
    loadingForAgreementMesafe: false,
    agremeentMesafe: "",
    loadingForAgreementIptal: false,
    agremeentIptal: ""
};

export default (state: UserState = intialState, action: Action) => {
  switch (action.type) {
    case LOADING_USER_AGREEMENT:
      return {
        ...state,
        loadingForAgreement: action.payload
      }
    case GET_USER_AGREEMENT :
      return {
        ...state,
        loadingForAgreement: false,
        agremeent: action.payload
      }
      case LOADING_USER_AGREEMENT_IPTAL:
        return {
          ...state,
          loadingForAgreementIptal: action.payload
        }
      case GET_USER_AGREEMENT_IPTAL :
        return {
          ...state,
          loadingForAgreementIptal: false,
          agremeentIptal: action.payload
        }
        case LOADING_USER_AGREEMENT_MESAFE:
          return {
            ...state,
            loadingForAgreementMesafe: action.payload
          }
        case GET_USER_AGREEMENT_MESAFE :
          return {
            ...state,
            loadingForAgreementMesafe: false,
            agremeentMesafe: action.payload
          }
    case LOADING_FORGOT_PASSWORD_CHANGE:
      return {
        ...state,
        isLoadingForgotPasswordChange: action.payload
      }
    case LOADING_FORGOT_PASSWORD:
    return {
      ...state,
      isLoadingForgotPassword: action.payload
    }
    case LOGIN_STARTED:
      return {
        ...state,
        isLoading: action.payload,
        loginErrorMessage :""
      };
    case LOGIN_SUCCEED:
        return {
          ...state,
          isFinished:true,
          isSucceed:true,
          isLoading:false,
          loginErrorMessage: action.payload
        };
    case LOGIN_FAILED:
        return {
            ...state,
            isFinished: true,
            isSucceed:false,
              isLoading:false,
              loginErrorMessage:action.payload
            };
    case RESET_PROPS :
        return {
          ...state,
          isFinished:false,
          isSucceed:false,
          isLoading:false,
          loginErrorMessage : ""
        };
    default:
      return state ;

  }
};
