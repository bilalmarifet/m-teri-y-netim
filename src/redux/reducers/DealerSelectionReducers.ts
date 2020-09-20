import {CustomerPriceProductState, Action} from '../states';
import {
  CUSTOMERPICE_PRODUCT_GET,
  CUSTOMERPICE_PRODUCT_LOADING,
  LOADING_GET_STORE_LIST,
  GET_STORE_LIST,
} from '../types';
import {homeStoreItemModels} from '../actions/DealerSelectionAction';

const intialState = {
  loading: false,
  storeList: [],
};
interface State {
  loading: boolean;
  storeList: homeStoreItemModels[];
}

export default (state: State = intialState, action: Action) => {
  switch (action.type) {
    case GET_STORE_LIST:
      return {
        ...state,
        storeList: action.payload,
        loading: false,
      };
    case LOADING_GET_STORE_LIST:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};
