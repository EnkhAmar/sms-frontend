import { HIDE_AUTH_MESSAGE, SHOW_AUTH_MESSAGE } from 'redux/constants/Auth';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    GET_USER,
    GET_USER_FAIL,
    GET_USER_LOADING,
} from '../constants/userConstants'
import axios from 'axios';
import {url} from 'configs/EnvironmentConfig';

const tokenFromStorage = localStorage.getItem('userToken') ? localStorage.getItem('userToken') : null;

const initialState = {
    token: tokenFromStorage,
    isLoading: false,
    isAuthenticated: false,
    user: null,
    showMessage: false,
    message: '',
}

export const userLoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: action.payload.user,
                isAuthenticated: true,
                redirect: '/',
                token: action.payload.token,
            }

        case USER_LOGIN_FAIL:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                token: null
            }
        case USER_LOGOUT:
            localStorage.removeItem("userToken")
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                token: null,
            }
        case SHOW_AUTH_MESSAGE:
            return {
                ...state,
                message: action.payload,
                showMessage: true,
                isLoading: false
            }
        case HIDE_AUTH_MESSAGE:
            return {
                ...state,
                message: '',
                showMessage: false,
            }
        case GET_USER:
          return {
            ...state,
            isLoading: false,
            user: action.payload.user,
          }
        case GET_USER_FAIL:
          localStorage.removeItem("userToken")
          return {
            ...state,
            isLoading: false,
            user: null,
            token: null,
          }
        case GET_USER_LOADING:
          return {
            ...state,
            isLoading: true
          }
        default:
            return state

    }
}
