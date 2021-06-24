import {
  SET_SCHOOL,
  SET_BRANCH,
} from '../constants/filterConstants';
import axios from 'axios';
import {url} from 'configs/EnvironmentConfig';

const initialState = {
    school: null,
    branch: null,
}

export const filterReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_SCHOOL:
        return {
            ...state,
            school: action.payload
        }
      case SET_BRANCH:
        return {
            ...state,
            branch: action.payload,
        }
      default:
          return state

    }
}
