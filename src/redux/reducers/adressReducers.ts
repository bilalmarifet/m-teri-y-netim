import { adress } from "../actions/adressAction";
import { AddUser, Action } from "../states";
import {ADD_USER_SUCCEED,ADD_USER_FAILED, ADRESS_GET, ADRESS_GET_LOADING, ADRESS_ADD_LOADING, ADRESS_EDIT_LOADING, ADRESS_CHANGE_SELECTED_ID} from "../types";

interface State {
    loading : boolean;
    adress: adress[];
    addAdressLoading: boolean;
    editAdressLoading : boolean;
    selectedAdressId: number;
    
}
const initalState = {
    loading: false,
    adress: [],
    addAdressLoading: false,
    editAdressLoading: false,
    selectedAdressId: 0
  };

export default (state: State = initalState, action: Action) => {
  switch (action.type) {
    case ADRESS_CHANGE_SELECTED_ID:
      return {
        ...state,
        selectedAdressId: action.payload
      }
    case ADRESS_EDIT_LOADING:
      return {
        ...state,
        editAdressLoading: action.payload
      }
    case ADRESS_ADD_LOADING:
      return {
        ...state,
        addAdressLoading: action.payload
      }
    case ADRESS_GET_LOADING:    
      return {
        ...state,
        loading:action.payload,

      };
      case ADRESS_GET:     
      return {
        ...state,
        loading:false,
        adress: action.payload
      };
    default:
      return state;
  }
};