import axios from "axios";
import {
  LISTINGS_REQUEST,
  LISTINGS_SUCCESS,
  LISTINGS_FAIL,
  LISTINGS_CREATE_REQUEST,
  LISTINGS_CREATE_SUCCESS,
  LISTINGS_CREATE_FAIL,
  LISTINGS_UPLOAD_PHOTO_REQUEST,
  LISTINGS_UPLOAD_PHOTO_SUCCESS,
  LISTINGS_UPLOAD_PHOTO_FAIL,
} from "../constants/listingsConstants";

export const fetchListings = () => async (dispatch) => {
  try {
    dispatch({ type: LISTINGS_REQUEST });
    const response = await fetch("api/listings/");
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

    console.log(listingData);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    // const { imageData } = await axios.post(
    //   "api/listings/uploadImage/",
    //   listingData.image[0],
    //   config
    // );
    // for (let i = 0; i < listingData.image.length; i++) {
    //   let { imageData } = await axios.post(
    //     "api/listings/uploadImage/",
    //     listingData.image[i],
    //     config
    //   );
    // }
    const { data } = await axios.post(
      "api/listings/create/",
      listingData,
      config
    );

    dispatch({
      type: LISTINGS_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LISTINGS_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createListingImage = (image) => async (dispatch) => {
  try {
    dispatch({ type: LISTINGS_UPLOAD_PHOTO_REQUEST });
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(
      "api/listings/uploadImage/",
      image,
      config
    );

    dispatch({
      type: LISTINGS_UPLOAD_PHOTO_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LISTINGS_UPLOAD_PHOTO_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
