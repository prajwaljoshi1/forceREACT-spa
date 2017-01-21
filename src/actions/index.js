
import { Config, CognitoIdentityCredentials } from "aws-sdk";
import { browserHistory  } from 'react-router';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails  } from "amazon-cognito-identity-js";
import cognitoConfig from "../cognito-config";

import { AUTH_USER , AUTH_ERROR, UNAUTH_USER, SUBSCRIPTION_STATUS} from './types';
import {  USERNAME , USER_EMAIL, USER_PASSWORD } from '../actions/types';

import axios from 'axios';
import API from '../api-url';
import  stripeConfig from  '../stripe-config';
import Scriptly from 'scriptly';


Config.region = cognitoConfig.region;
Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: cognitoConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});




export function signinUser({ email, password }){

  const authenticationData = {
    Username: email,
    Password: password
  }

  const authenticationDetails = new AuthenticationDetails(authenticationData);


    const userData = {
    Username :email ,
    Pool : userPool
  };


  const cognitoUser = new CognitoUser(userData);


  return function(dispatch){

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {


            console.log(result);
             const authCode = result.idToken.jwtToken ;
            axios.get(API.getSubscriptionStatus, {
                       headers: {
                           'Content-Type':'application/json',
                           'Authorization': authCode
                           }
                         })
                         .then(function (response) {

                              dispatch({type:SUBSCRIPTION_STATUS, payload: response.data});
                              dispatch({type:AUTH_USER});
                              console.log("RESPONSE => ", response.data);
                              browserHistory.push('/dashboard');
                          });

            //save the Json web token
            //localStorage.setItem('token',result.getAccessToken().getJwtToken()); cognito has its own
            //redirect user to home




        },

        onFailure: function(err) {

            dispatch(authError(err.message));
        },

    });

  }

}


  export function signupUser({ email, password , givenName, familyName, mobile }){



    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      }),new CognitoUserAttribute({
        Name: 'family_name',
        Value: familyName
      }),new CognitoUserAttribute({
        Name: 'phone_number',
        Value: mobile
      }),new CognitoUserAttribute({
        Name: 'given_name',
        Value: givenName
      })
    ];

    return function(dispatch){
        // const username =givenName.toLowerCase() + Date.now().toString();
        const username = email.replace(/@/g, '.');

        userPool.signUp(username, password, attributeList, null, (err, result) => {
            if (err) {
                dispatch(authError(err.message));
                return;
              }

              dispatch({
                type:USERNAME,
                payload:username
              });

              dispatch({
                type:USER_EMAIL,
                payload:email
              });

              dispatch({
                type:USER_PASSWORD,
                payload:password
              });

                browserHistory.push('/confirmation');
              });

    }


}


export function signoutUser(){


  // const poolData = {
  //           UserPoolId : cognitoConfig.UserPoolId,
  //           ClientId : cognitoConfig.ClientId
  //         };
  //
  //
  // const userPool = new CognitoUserPool(poolData);

  const cognitoUser = userPool.getCurrentUser();

  if(cognitoUser != null){
    cognitoUser.signOut();
  }
  return {type:UNAUTH_USER}



  //localStorage.removeItem('token'); //cognito has its own



}


export function authError(error){
   return {
     type: AUTH_ERROR,
     payload:error
   }
}








export function confirmUser({confirmationCode, username, password} ){
  return function(dispatch){
    const userData = {
    Username : username,
    Pool : userPool
};

const cognitoUser = new CognitoUser(userData);
cognitoUser.confirmRegistration(confirmationCode, true, function(err, result) {
    if (err) {
        dispatch(authError(err.message));
        return;
    }else{
      if(result == "SUCCESS"){
        // the action creator signinUser takes email only , however cognito works on both to be refactored later
        dispatch(signinUser({email:username, password}));
      }
    }


});

  }
}

export function resendVerificationCode({username}){
  return function(dispatch){

    const userData = {
      Username : username,
      Pool : userPool
    };

const cognitoUser = new CognitoUser(userData);

    cognitoUser.resendConfirmationCode(function(err, result) {
        if (err) {
            dispatch(authError(err.message));
            return;
        }
        dispatch(authError("Confirmation code sent again."));
    });

  }
};




function getStripeToken(card){
  console.log("LEVEL2");
    return  new Promise((res,rej) =>{

      Stripe.setPublishableKey(stripeConfig.PublishableKey);
      Stripe.card.createToken(card, (status, response) => {
        if(response.error){
            rej(response.error)
        }else{
          res(response.id)
        }
      });
    });
}

export function setStripeToken( {cardNumber, CVC, expirationMonth, expirationYear }){

      const card = {
        number:cardNumber,
        exp_month: expirationMonth,
        exp_year: expirationYear,
        cvc: CVC
      }




      return function(dispatch){
      const payload = Scriptly.loadJavascript('https://js.stripe.com/v2/')
                              .then(() => (getStripeToken(card)))
                              .then((token) => {
                                console.log("success ",dispatch);
                                  dispatch(startSubscription( token));
                              })
                              .catch((e) => {
                                console.log("failure ",dispatch);
                                dispatch(authError(e.message));
                              });


      }

}

function startSubscription( token){

  // const poolData = {
  //           UserPoolId : cognitoConfig.UserPoolId,
  //           ClientId : cognitoConfig.ClientId
  //         };
  // var userPool = new CognitoUserPool(poolData);

  return function(dispatch){
    console.log("LEVEL3");

    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
         cognitoUser.getSession(function(err, session) {
             if (err) {
                alert(err);
                 return;
             }
             const authCode = session.idToken.jwtToken ;
             axios.post(API.postStripeToken,
                            {
                                  'stripe-token':token
                            }, {
                        headers: {
                            'Content-Type':'application/json',
                            'Authorization': authCode,
                          }


                          })
                          .then(function (response) {
                              console.log("LEVEL4");
                               store.dispatch({type:SUBSCRIPTION_STATUS, payload: response.data});
                               console.log("RESPONSE => ", response.data);
                               browserHistory.push('/dashboard');

                            }).catch(function(err){
                              console.log("LEVEL4 err", token);
                              console.log("ERROR :",err);
                            });

            });
         }

  }


     }


// function updateStripeToken(username, token){
//   console.log("USERNAME3:   ", username);
//
//
//   const userData = {
//     Username : username,
//     Pool : userPool
//   };
//
//  const cognitoUser = new CognitoUser(userData);
//
//   const attributeList = [];
//   let attribute = {
//       Name : 'stripe-token',
//       Value : token
//     };
//
//     attribute = new CognitoUserAttribute(attribute);
//   attributeList.push(attribute);
//
//   cognitoUser.updateAttributes(attributeList, function(err, result) {
//     if (err) {
//         return(authError("Something went wrong. Please signup again"));
//         return;
//         return ({
//           type:STRIPE_TOKEN,
//           payload:token
//         });
//           browserHistory.push('/confirmation')
//     }
//
// });
//
// }


export function redirectAuthUserToHome({authStatus}){
    return function(dispatch){

          //else dispatch welcome tasks
        }
}
