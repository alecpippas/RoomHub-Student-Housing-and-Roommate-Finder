import axios from "axios";
import { getState } from "react";
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
} from "../constants/userConstants";

axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export const signup = (fname, lname, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_SIGNUP_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "api/users/register/",
      {
        fname: fname,
        lname: lname,
        email: email,
        password: password,
      },
      config
    );

    dispatch({
      type: USER_SIGNUP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_SIGNUP_FAIL,
      payload:
        error.response && error.response.data.details
          ? error.response.data.details
          : error.message,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    console.log("Function working");
    const { data } = await axios.post(
      "/api/users/login/",
      {
        username: email,
        password: password,
      },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
};

export const getProfile = (username) => async (dispatch) => {
  try {
    dispatch({
      type: USER_GET_PROFILE_REQUEST,
    });
    const { data } = await axios.get(`/api/users/profile/display/${username}/`);

    dispatch({
      type: USER_GET_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_GET_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Implement the updateProfile action
export const updateProfile =
  (
    username,
    fname,
    lname,
    bio,
    age,
    gender,
    school,
    pets,
    allergies,
    budget,
    sleep_schedule,
    profile_picture
  ) =>
  async (dispatch) => {
    try {
      dispatch({
        type: USER_UPDATE_PROFILE_REQUEST,
      });
      // const {
      //   userLogin: { userInfo },
      // } = getState(); // Assuming you store logged-in user info in state
      console.log([
        username,
        fname,
        lname,
        bio,
        age,
        gender,
        school,
        pets,
        allergies,
        budget,
        sleep_schedule,
        profile_picture,
      ]);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${userInfo.token}`, // Assuming your backend uses token-based auth
        },
      };

      const { data } = await axios.post(
        "/api/users/profile/update/",
        {
          username: username,
          first_name: fname,
          last_name: lname,
          bio: bio,
          age: age,
          gender: gender,
          school: school,
          pets: pets,
          allergies: allergies,
          budget: budget,
          sleep_schedule: sleep_schedule,
          profile_picture: profile_picture,
        },
        config
      );
      dispatch({
        type: USER_UPDATE_PROFILE_SUCCESS,
        payload: data,
      });

      // Optionally update user info in local state if profile update affects user info
    } catch (error) {
      dispatch({
        type: USER_UPDATE_PROFILE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
