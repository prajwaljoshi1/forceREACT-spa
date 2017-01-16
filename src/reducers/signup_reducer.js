import {  USERNAME , USER_EMAIL , STRIPE_TOKEN, USER_PASSWORD  } from '../actions/types';

export default function(state = {}, action ){
  switch(action.type){
    case USERNAME:
        {
          return  {...state, username:action.payload};
        }
    case USER_EMAIL:
      {
        return {...state, userEmail:action.payload}
      }
    case STRIPE_TOKEN:
      {
        return {...state , stripeToken:action.payload}
      }
      case USER_PASSWORD:
        {
          console.log("prajwal => ", action.payload);
          return {...state , userPassword:action.payload}
        }

  }

  return  state
}
