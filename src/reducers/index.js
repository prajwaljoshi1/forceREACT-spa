import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import signupReducer from './signup_reducer.js'

const rootReducer = combineReducers({
  form,
  auth:authReducer,
  signup:signupReducer
 });

export default rootReducer;
