import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

// import {composeWithDevTools}
import {
  userLoginReducers,
  userSignupReducers,
  userSettingsReducers,
  userProfileReducers,
} from "../reducers/userReducers";
import {
  listingsViewReducer,
  listingsCreateReducer,
  listingsUploadImageReducer,
  listingViewReducer,
} from "../reducers/listingsReducers";

const reducer = combineReducers({
  userLogin: userLoginReducers,
  userSignup: userSignupReducers,
  userSettings: userSettingsReducers,
  userProfile: userProfileReducers,
  listingsView: listingsViewReducer,
  listingView: listingViewReducer,
  listingsCreate: listingsCreateReducer,
  listingsUploadImage: listingsUploadImageReducer,
});

const initialState = {};
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;
