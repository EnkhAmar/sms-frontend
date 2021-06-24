import { combineReducers } from 'redux';
import Auth from './Auth';
import Theme from './Theme';
import {userLoginReducer} from './userReducers';
import {staffsListReducer} from './staffsReducers';
import {filterReducer} from './filterReducers';

const reducers = combineReducers({
    theme: Theme,
    auth: Auth,
    userLogin: userLoginReducer,
    staffsList: staffsListReducer,
    filters: filterReducer,
});

export default reducers;
