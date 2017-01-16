
import { Config, CognitoIdentityCredentials } from "aws-sdk";
import { browserHistory  } from 'react-router';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails  } from "amazon-cognito-identity-js";
import cognitoConfig from "../cognito-config";

import { AUTH_USER , AUTH_ERROR, UNAUTH_USER} from './types';
import {  USERNAME , USER_EMAIL , STRIPE_TOKEN, USER_PASSWORD } from '../actions/types';

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
            dispatch({type: AUTH_USER});
            //save the Json web token
            //localStorage.setItem('token',result.getAccessToken().getJwtToken()); cognito has its own
            //redirect user to home

            browserHistory.push('/home')

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
        Name: 'birthdate',
        Value: "00-00-0000"
      }),new CognitoUserAttribute({
        Name: 'given_name',
        Value: givenName
      })
    ];

    return function(dispatch){
        const username =givenName.toLowerCase() + Date.now().toString();
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
  //localStorage.removeItem('token'); //cognito has its own
  const user = localStorage.getItem("CognitoIdentityServiceProvider.5q9vq8tbro1m2pol9dp7jp277i.LastAuthUser");

  const userData = {
  Username :user ,
  Pool : userPool
};

  const cognitoUser = new CognitoUser(userData);

  cognitoUser.signOut();
  return {type:UNAUTH_USER}
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
