import { combineReducers } from 'redux';
import userReducer from './userReducer'
import mainPageReducer from './mainPageReducer';

const reducers = combineReducers({
  user: userReducer,
  mainpage: mainPageReducer
});


export default reducers