import {
  LISTINGS_REQUEST,
  LISTINGS_SUCCESS,
  LISTINGS_FAIL,
  LISTINGS_CREATE_REQUEST,
  LISTINGS_CREATE_SUCCESS,
  LISTINGS_CREATE_FAIL,
} from "../constants/listingsConstants";

export const listingsViewReducer = (state = { listings: [] }, action) => {
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
      return {
        ...state,
        loadingCreate: false,
        success: true,
        listings: [...state.listings, action.payload],
      };
    case LISTINGS_CREATE_FAIL:
      return { ...state, loadingCreate: false, errorCreate: action.payload };
    default:
      return state;
  }
};

export const listingsCreateReducer = (state = { listings: [] }, action) => {
  switch (action.type) {
    case LISTINGS_CREATE_REQUEST:
      return { loadingCreate: true, ...state };
    case LISTINGS_CREATE_SUCCESS:
      return {
        loadingCreate: false,
        listings: action.payload,
      };
    case LISTINGS_CREATE_FAIL:
      return { loadingCreate: false, error: action.payload };
    default:
      return state;
  }
};
