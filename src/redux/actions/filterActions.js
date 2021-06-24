import {
  SET_SCHOOL,
  SET_BRANCH,
} from '../constants/filterConstants'
import axios from 'axios'
import { url } from 'configs/EnvironmentConfig'

export const setSchool = (school) => async (dispatch) => {
  dispatch({
    type: SET_SCHOOL,
    payload: school
  })
}

export const setBranch = (branch) => async(dispatch) => {
  dispatch({
    type: SET_BRANCH,
    payload: branch
  })
};
