import {  USERNAME , USER_EMAIL , STRIPE_TOKEN, USER_PASSWORD, USER_FAMILYNAME, USER_GIVENNAME, USER_MOBILE  } from '../actions/types';

export default function(state = {}, action ){
  switch(action.type){
    case USERNAME:
        {
          return  {...state, username:action.payload};
        }
    case USER_EMAIL:
      {
        return {...state, userEmail:action.payload};
      }
      case USER_PASSWORD:
        {
          return {...state, userPassword:action.payload};
        }
  }

  return  state
}
