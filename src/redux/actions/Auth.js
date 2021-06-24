import axios from 'axios';
import {
  SIGNIN,
  AUTHENTICATED,
  SIGNOUT,
  SIGNOUT_SUCCESS,
  SHOW_AUTH_MESSAGE,
  HIDE_AUTH_MESSAGE,
  SIGNUP,
  SIGNUP_SUCCESS,
  SHOW_LOADING,
  SIGNIN_WITH_GOOGLE,
  SIGNIN_WITH_GOOGLE_AUTHENTICATED,
  SIGNIN_WITH_FACEBOOK,
  SIGNIN_WITH_FACEBOOK_AUTHENTICATED
} from '../constants/Auth';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
} from '../constants/userConstants'

export const signIn = ({ email, password }) => async (dispatch) => {
  try {
      dispatch({
          type: USER_LOGIN_REQUEST
      })
      
      const config = {
          headers: {
              'Content-type': 'application/json'
          }
      }

      const { data } = await axios.post(
          '/api/auth/login/',
          {'email': email, 'password': password},
          config
      )

      dispatch({
          type: USER_LOGIN_SUCCESS,
          payload: data.access_token
      })

      localStorage.setItem('userToken', JSON.stringify(data.access_token))

  } catch (error) {
      
      dispatch({
          type: USER_LOGIN_FAIL,
          payload: error.message && error.response.data
      })

  }
}

export const authenticated = (token) => (dispatch) => {
  return dispatch(
    {
       type: AUTHENTICATED,
       token
     }
  )
};

export const signOut = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({
    type: SIGNOUT
  });
};

export const signOutSuccess = () => {
  return {
    type: SIGNOUT_SUCCESS,
  }
};

export const signUp = (user) => {
  return {
    type: SIGNUP,
    payload: user
  };
};

export const signUpSuccess = (token) => {
  return {
    type: SIGNUP_SUCCESS,
    token
  };
};

export const signInWithGoogle = () => {
  return {
    type: SIGNIN_WITH_GOOGLE
  };
};

export const signInWithGoogleAuthenticated = (token) => {
  return {
    type: SIGNIN_WITH_GOOGLE_AUTHENTICATED,
    token
  };
};

export const signInWithFacebook = () => {
  return {
    type: SIGNIN_WITH_FACEBOOK
  };
};

export const signInWithFacebookAuthenticated = (token) => {
  return {
    type: SIGNIN_WITH_FACEBOOK_AUTHENTICATED,
    token
  };
};

export const showAuthMessage = (message) => {
  return {
    type: SHOW_AUTH_MESSAGE,
    message
  };
};

export const hideAuthMessage = () => {
  return {
    type: HIDE_AUTH_MESSAGE,
  };
};

export const showLoading = () => {
  return {
    type: SHOW_LOADING,
  };
};
