import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  USER_LOGOUT,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_GET_PROFILE_REQUEST,
  USER_GET_PROFILE_SUCCESS,
  USER_GET_PROFILE_FAIL,
  USER_POST_COMM_REQUEST,
  USER_POST_COMM_SUCCESS,
  USER_POST_COMM_FAIL,
  USER_FAV_REQUEST,
  USER_FAV_SUCCESS,
  USER_FAV_FAIL,
  USER_GET_FAVS_REQUEST,
  USER_GET_FAVS_SUCCESS,
  USER_GET_FAVS_FAIL,
  USER_CHECK_FAV_REQUEST,
  USER_CHECK_FAV_SUCCESS,
  USER_CHECK_FAV_FAIL,
  USER_DEL_FAV_REQUEST,
  USER_DEL_FAV_SUCCESS,
  USER_DEL_FAV_FAIL,
} from "../constants/userConstants";

export const userSignupReducers = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGNUP_REQUEST:
      return { loading: true };
    case USER_SIGNUP_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_SIGNUP_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userLoginReducers = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userSettingsReducers = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true };
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, userProfile: action.payload };
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userProfileReducers = (state = { profile: [] }, action) => {
  switch (action.type) {
    case USER_GET_PROFILE_REQUEST:
      return { loading: true, ...state };
    case USER_GET_PROFILE_SUCCESS:
      return { loading: false, profile: action.payload };
    case USER_GET_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userPostCommentReducers = (state = {}, action) => {
  switch (action.type) {
    case USER_POST_COMM_REQUEST:
      return { loading: true, ...state };
    case USER_POST_COMM_SUCCESS:
      return { loading: false, comment: action.payload };
    case USER_POST_COMM_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userAddFavReducers = (state = {}, action) => {
  switch (action.type) {
    case USER_FAV_REQUEST:
      return { loading: true, ...state };
    case USER_FAV_SUCCESS:
      return { loading: false, fav: action.payload };
    case USER_FAV_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userGetFavsReducers = (state = { favs: [] }, action) => {
  switch (action.type) {
    case USER_GET_FAVS_REQUEST:
      return { loading: true, ...state };
    case USER_GET_FAVS_SUCCESS:
      return { loading: false, favs: action.payload };
    case USER_GET_FAVS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userCheckFavReducers = (state = {}, action) => {
  switch (action.type) {
    case USER_CHECK_FAV_REQUEST:
      return { loading: true, ...state };
    case USER_CHECK_FAV_SUCCESS:
      return { loading: false, isFav: action.payload };
    case USER_CHECK_FAV_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userDelFavReducer = (state = { favs: [] }, action) => {
  switch (action.type) {
    case USER_DEL_FAV_REQUEST:
      return { loading: true, ...state };
    case USER_DEL_FAV_SUCCESS:
      return {
        loading: false,
        favs: action.payload,
      };
    case USER_DEL_FAV_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
