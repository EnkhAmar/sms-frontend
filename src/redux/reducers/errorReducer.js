import { CLEAR_ERRORS, GET_ERRORS } from "redux/constants/error"


const initialState = {
    msg: null,
    status: null,
    id: null
}

export default (state=initialState, action) => {
    switch(action.type) {
        case GET_ERRORS: 
            return {
                ...state,
                msg: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                msg: null,
                status: null,
                id: null
            }
        default: 
            return state
    }
}