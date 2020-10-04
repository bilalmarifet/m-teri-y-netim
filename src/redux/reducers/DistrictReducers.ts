
import { District } from "../actions/DistrictAction";
import {EMPLOYEECOST_EDIT_SUCCEED,EMPLOYEECOST_EDIT_FAILED, LOADING_GET_DISTRICT, GET_DISTRICT, LOADING_ADD_DISTRICT, LOADING_REMOVE_DISTRICT} from "../types";


interface DistrictState {
    loading: boolean;
    DistrictList: District[],
    
}
const initalState = {
    loading: false,
    DistrictList: [],
    
  };

export default (state: DistrictState = initalState, action: Action) => {
  switch (action.type) {
    case LOADING_GET_DISTRICT:    
      return {
        ...state,
        loading: action.payload
      };
      case GET_DISTRICT:     
      return {
        ...state,
        DistrictList: action.payload    
      };
    default:
      return state;
  }
};