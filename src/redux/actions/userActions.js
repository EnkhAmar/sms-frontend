import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_LOGOUT,
    GET_USER,
    GET_USER_FAIL,
    GET_USER_LOADING,
    SHOW_AUTH_MESSAGE,
    HIDE_AUTH_MESSAGE,
} from '../constants/userConstants'
import axios from 'axios'
import { url } from 'configs/EnvironmentConfig'

export const login = ({ email, password }) => async (dispatch) => {
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
            `${url}/api/auth/login/`,
            {'email': email, 'password': password},
            config
        )

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: {
                token: data.access_token,
                user: data.user
            }
        })

        localStorage.setItem('userToken', data.access_token)

    } catch (error) {
        dispatch({
            type: SHOW_AUTH_MESSAGE,
            message: Object.values(error.response.data)[0]
        })
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: Object.values(error.response.data)[0]
        })
    }
}

export const showAuthMessage = (message) => async(dispatch) => {
    dispatch({
      type: SHOW_AUTH_MESSAGE,
      message: message
    })
};

export const hideAuthMessage = () => async(dispatch) => {

    dispatch({
      type: HIDE_AUTH_MESSAGE,
    })
}

export const logout = () => async (dispatch, getState) => {
    const { userLogin: { token }, } = getState()


    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const { data } = await axios.post(
        `${url}/api/auth/logout/`,
        config
    )

    dispatch({
        type: USER_LOGOUT,
    })
}

export const getUser = () => async(dispatch, getState) => {
  try {
    dispatch({
      type: GET_USER_LOADING,
    })
    const { userLogin: { token }, } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    const { data } = await axios.get(
      `${url}/api/auth/user/`,
      config
    )

    dispatch({
      type: GET_USER,
      payload: {
        user: data,
      }
    })
  } catch (e) {
    dispatch({
      type: GET_USER_FAIL,
    })
  }
}
