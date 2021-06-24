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

const initialState = {
    loading: false,
    teachers: [],
    operators: [],
    admins: [],
    accountants: [],
}

export const staffsListReducer = (state = initialState, action) => {
    switch(action.type) {
        case TEACHERS_LIST_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case TEACHERS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                teachers: action.payload,
            }

        case TEACHERS_LIST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }

        case OPERATORS_LIST_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case OPERATORS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                operators: action.payload,
            }

        case OPERATORS_LIST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case ADMINS_LIST_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case ADMINS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                admins: action.payload,
            }

        case ADMINS_LIST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }

        case ACCOUNTANTS_LIST_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case ACCOUNTANTS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                accountants: action.payload,
            }

        case ACCOUNTANTS_LIST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }

        default:
            return state;
    }
}