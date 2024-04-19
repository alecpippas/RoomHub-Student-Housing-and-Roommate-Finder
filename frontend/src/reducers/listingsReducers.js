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
    case LISTINGS_CREATE_REQUEST:
      return { loading: true };
    case LISTINGS_CREATE_SUCCESS:
      return {
        loading: false,
        image: action.payload,
      };
    case LISTINGS_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
