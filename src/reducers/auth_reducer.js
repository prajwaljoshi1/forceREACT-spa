// import { combineReducers } from 'redux';
// import {reducer as form } form 'redux-form';
// import authReducer from './auth_reducer';

import { AUTH_USER , UNAUTH_USER } from '../actions/types';

export default function(state = {}, action ){
  switch(action.type){
    case AUTH_USER:
        {
          return  {...state, authenticated:true};
        }
    case UNAUTH_USER:
    {
      return {...state, authenticated:false}
    }

  }

  return  state
}
