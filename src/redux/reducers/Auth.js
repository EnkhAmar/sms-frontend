import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS } from 'redux/constants/userConstants';
import {
	AUTH_TOKEN,
	AUTHENTICATED,
	SHOW_AUTH_MESSAGE,
	HIDE_AUTH_MESSAGE,
	SIGNOUT_SUCCESS,
	SIGNUP_SUCCESS,
	SHOW_LOADING,
	SIGNOUT,
} from '../constants/Auth';

const tokenFromStorage = localStorage.getItem('userToken') ? localStorage.getItem('userToken') : null;

const initState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
  token: tokenFromStorage,
}

const auth = (state = initState, action) => {
	switch (action.type) {
		case USER_LOGIN_REQUEST:
			return {
				...state,
				loading: true,
			}
		case USER_LOGIN_SUCCESS:
			return {
				...state,
				loading: false,
				redirect: '/',
				userInfo: action.payload
			}
		case USER_LOGIN_FAIL:
			return {
				...state,
				error: action.payload,
			}



		case AUTHENTICATED:
			return {
				...state,
				loading: false,
				redirect: '/',
				token: action.token
			}
		case SHOW_AUTH_MESSAGE:
			return {
				...state,
				message: action.message,
				showMessage: true,
				loading: false
			}
		case HIDE_AUTH_MESSAGE:
			return {
				...state,
				message: '',
				showMessage: false,
			}
		case SIGNOUT_SUCCESS: {
			return {
				...state,
				token: null,
				redirect: '/',
				loading: false
			}
		}
		case SIGNUP_SUCCESS: {
			return {
			  ...state,
			  loading: false,
			  token: action.token
			}
		}
		case SHOW_LOADING: {
			return {
				...state,
				loading: false
			}
		}
		case SIGNOUT: {
			return {
				...state,
				loading: true
			}
		}
		default:
			return state;
	}
}

export default auth
