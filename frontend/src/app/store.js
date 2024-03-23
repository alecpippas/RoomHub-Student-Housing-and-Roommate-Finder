import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";

// import {composeWithDevTools}
import {
  userLoginReducers,
  userSignupReducers,
} from "../reducers/userReducers";

const reducer = combineReducers({
  userLogin: userLoginReducers,
  userSignup: userSignupReducers
});

const initialState={}
const middleware=[thunk]
const store = createStore(reducer, initialState, applyMiddleware(...middleware))

export default store;