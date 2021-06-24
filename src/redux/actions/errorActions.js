import { CLEAR_ERRORS, GET_ERRORS } from "redux/constants/error"

export const returnErrors = (msg, status, id=null) => {
    return {
        type: GET_ERRORS,
        payload: { msg, status, id }
    }
}

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    }
}