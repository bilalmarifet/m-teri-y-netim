import { adress } from "../actions/adressAction";
import { Category } from "../actions/categoryAction";
import { AddUser, Action } from "../states";
import {ADD_USER_SUCCEED,ADD_USER_FAILED, ADRESS_GET, ADRESS_GET_LOADING, ADRESS_ADD_LOADING, ADRESS_EDIT_LOADING, ADRESS_CHANGE_SELECTED_ID, GET_CATEGORIES_LIST, GET_CATEGORIES_LOADING} from "../types";

interface State {
    loading : boolean;
    categoryList: Category[];
}
const initalState = {
    loading: false,
    categoryList: []
  };

export default (state: State = initalState, action: Action) => {
  switch (action.type) {
    case GET_CATEGORIES_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    case GET_CATEGORIES_LIST:
      return {
        ...state,
        loading: false,
        categoryList: action.payload
      }
    default:
      return state;
  }
};