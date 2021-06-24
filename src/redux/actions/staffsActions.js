import {
    TEACHERS_LIST_REQUEST,
    TEACHERS_LIST_SUCCESS,
    TEACHERS_LIST_FAIL,

    OPERATORS_LIST_REQUEST,
    OPERATORS_LIST_SUCCESS,
    OPERATORS_LIST_FAIL,

    ADMINS_LIST_REQUEST,
    ADMINS_LIST_SUCCESS,
    ADMINS_LIST_FAIL,

    ACCOUNTANTS_LIST_REQUEST,
    ACCOUNTANTS_LIST_SUCCESS,
    ACCOUNTANTS_LIST_FAIL,
} from '../constants/staffsConstants'
import axios from 'axios'
import { url } from 'configs/EnvironmentConfig'

export const listTeachers = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: TEACHERS_LIST_REQUEST,
        })

        const { userLogin: { token } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        const { data } = await axios.get(
            `${url}/api/auth/action/4/group/`,
            config
        )

         

        dispatch({
            type: TEACHERS_LIST_SUCCESS,
            payload: data.results
        })

    } catch (error) {
         
        dispatch({
            type: TEACHERS_LIST_FAIL,
            payload: error
        })
    }
}


export const listOperators = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: OPERATORS_LIST_REQUEST,
        })

        const { userLogin: { token } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        }

        const { data } = await axios.get(
            `${url}/api/auth/action/3/group/`,
            config
        )
         
        dispatch({
            type: OPERATORS_LIST_SUCCESS,
            payload: data.results
        })
    } catch (error) {
         
        dispatch({
            type: OPERATORS_LIST_FAIL,
            payload: error
        })
    }
}


export const listAdmins = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ADMINS_LIST_REQUEST,
        })

        const { userLogin: { token } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        const { data } = await axios.get(
            `$${url}/api/auth/action/2/group/`,
            config
        )

        dispatch({
            type: ADMINS_LIST_SUCCESS,
            payload: data.results
        })
    } catch (error) {
         
        dispatch({
            type: ADMINS_LIST_FAIL,
            payload: error
        })
    }
}


export const listAccounts = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ACCOUNTANTS_LIST_REQUEST,
        })

        const { userLogin: { token } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        const { data } = await axios.get(
            `${url}/api/auth/action/6/group/`,
            config
        )

        dispatch({
            type: ACCOUNTANTS_LIST_SUCCESS,
            payload: data.results
        })
    } catch (error) {
         
        dispatch({
            type: ACCOUNTANTS_LIST_FAIL,
            payload: error
        })
    }
}