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
  LISTING_DELETE_REQUEST,
  LISTING_DELETE_SUCCESS,
  LISTING_DELETE_FAIL,
  LISTING_VIEW_COMM_REQUEST,
  LISTING_VIEW_COMM_SUCCESS,
  LISTING_VIEW_COMM_FAIL,
} from "../constants/listingsConstants";

export const listingsViewReducer = (state = { listings: [] }, action) => {
  switch (action.type) {
    case LISTINGS_REQUEST:
      return { loading: true, ...state };
    case LISTINGS_SUCCESS:
      let listingDetails = action.payload.postData;
      for (let i = 0; i < action.payload.postData.length; i++) {
        let currPost = action.payload.postData[i];
        listingDetails[i]["image"] = [];
        for (let j = 0; j < action.payload.imageData.length; j++) {
          let currImg = action.payload.imageData[j];
          if (currPost[["created_at"]] === currImg["created_at"]) {
            listingDetails[i]["image"].push(currImg);
          }
        }
      }
      return { loading: false, listings: listingDetails };
    case LISTINGS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const listingViewReducer = (state = { listing: [] }, action) => {
  switch (action.type) {
    case LISTING_REQUEST:
      return { loading: true, ...state };
    case LISTING_SUCCESS:
      let listingDetails = action.payload.postData[0];
      listingDetails["image"] = [];
      for (let i = 0; i < action.payload.imageData.length; i++) {
        let currImg = action.payload.imageData[i];
        if (listingDetails["created_at"] === currImg["created_at_id"]) {
          listingDetails["image"].push(currImg);
        }
      }
      return { loading: false, listing: listingDetails };
    case LISTING_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const listingsCreateReducer = (state = { listings: [] }, action) => {
  switch (action.type) {
    case LISTINGS_CREATE_REQUEST:
      return { loading: true, ...state };
    case LISTINGS_CREATE_SUCCESS:
      return {
        loading: false,
        listings: action.payload,
      };
    case LISTINGS_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const listingsUploadImageReducer = (state = {}, action) => {
  switch (action.type) {
    case LISTINGS_UPLOAD_PHOTO_REQUEST:
      return { loading: true };
    case LISTINGS_UPLOAD_PHOTO_SUCCESS:
      return {
        loading: false,
        image: action.payload,
      };
    case LISTINGS_UPLOAD_PHOTO_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const listingsDeleteReducer = (state = { listings: [] }, action) => {
  switch (action.type) {
    case LISTING_DELETE_REQUEST:
      return { loading: true, ...state };
    case LISTING_DELETE_SUCCESS:
      return {
        loading: false,
        listings: action.payload,
      };
    case LISTING_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const listingCommentsReducer = (
  state = { comments: undefined },
  action
) => {
  switch (action.type) {
    case LISTING_VIEW_COMM_REQUEST:
      return { loading: true, ...state };
    case LISTING_VIEW_COMM_SUCCESS:
      return { loading: false, comments: action.payload };
    case LISTING_VIEW_COMM_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
