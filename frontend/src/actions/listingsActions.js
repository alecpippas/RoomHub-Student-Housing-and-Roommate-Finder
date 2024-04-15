import axios from "axios";
import { 
  LISTINGS_REQUEST, 
  LISTINGS_SUCCESS, 
  LISTINGS_FAIL,
  LISTINGS_CREATE_REQUEST,
  LISTINGS_CREATE_SUCCESS,
  LISTINGS_CREATE_FAIL
} from '../constants/listingsConstants';


export const fetchListings = () => async (dispatch) => {
  try {
    dispatch({ type: LISTINGS_REQUEST });
    const response = await fetch('api/listings/');
    const data = await response.json();
    
    dispatch({
      type: LISTINGS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LISTINGS_FAIL,
      payload: error.message,
    });
  }
};

export const createListing = (listingData) => async (dispatch) => {
  try {
    dispatch({ type: LISTINGS_CREATE_REQUEST });

    const { data } = await axios.post('api/listings/create/', listingData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    dispatch({
      type: LISTINGS_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LISTINGS_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};