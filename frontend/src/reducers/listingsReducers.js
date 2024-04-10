import { 
  LISTINGS_REQUEST, 
  LISTINGS_SUCCESS, 
  LISTINGS_FAIL,
  LISTINGS_CREATE_REQUEST,
  LISTINGS_CREATE_SUCCESS,
  LISTINGS_CREATE_FAIL
} from '../constants/listingsConstants';

export const listingsReducer = (state = { listings: [], loading: false }, action) => {
  switch (action.type) {
    case LISTINGS_REQUEST:
      return { loading: true, listings: [] };
    case LISTINGS_SUCCESS:
      return { loading: false, listings: action.payload };
    case LISTINGS_FAIL:
      return { loading: false, error: action.payload };
    case LISTINGS_CREATE_REQUEST:
      return { ...state, loadingCreate: true };
    case LISTINGS_CREATE_SUCCESS:
      return { ...state, loadingCreate: false, success: true, listings: [...state.listings, action.payload] };
    case LISTINGS_CREATE_FAIL:
      return { ...state, loadingCreate: false, errorCreate: action.payload };
    default:
      return state;
  }
};