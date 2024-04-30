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
  LISTING_REQUEST,
  LISTING_SUCCESS,
  LISTING_FAIL,
  LISTING_UPDATE_REQUEST,
  LISTING_UPDATE_SUCCESS,
  LISTING_UPDATE_FAIL,
  LISTING_DELETE_REQUEST,
  LISTING_DELETE_SUCCESS,
  LISTING_DELETE_FAIL,
  LISTING_VIEW_COMM_REQUEST,
  LISTING_VIEW_COMM_SUCCESS,
  LISTING_VIEW_COMM_FAIL,
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

export const fetchListing = (pk) => async (dispatch) => {
  try {
    dispatch({ type: LISTING_REQUEST });
    const response = await fetch(`api/listings/${pk}/`);
    const data = await response.json();

    dispatch({
      type: LISTING_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LISTING_FAIL,
      payload: error.message,
    });
  }
};

export const createListing = (listingData) => async (dispatch) => {
  try {
    dispatch({ type: LISTINGS_CREATE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
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

export const updateListing = (listingData, pk) => async (dispatch) => {
  try {
    dispatch({ type: LISTING_UPDATE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "*",
      },
    };
    const { data } = await axios.post(
      `api/listings/update/${pk}/`,
      listingData,
      config
    );

    dispatch({
      type: LISTING_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LISTING_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteListing = (pk) => async (dispatch) => {
  try {
    dispatch({ type: LISTING_DELETE_REQUEST });

    const { data } = await axios.delete(`api/listings/remove/${pk}/`, pk);

    dispatch({
      type: LISTING_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LISTING_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getComments = (id) => async (dispatch) => {
  try {
    dispatch({ type: LISTING_VIEW_COMM_REQUEST });
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };

    const { data } = await axios.get(`api/getComments/${id}/`);

    dispatch({
      type: LISTING_VIEW_COMM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LISTING_VIEW_COMM_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
