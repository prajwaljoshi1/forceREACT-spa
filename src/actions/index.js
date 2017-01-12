
import { Config, CognitoIdentityCredentials } from "aws-sdk";
import { browserHistory } from 'react-router';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails  } from "amazon-cognito-identity-js";
import cognitoConfig from "../cognito-config";

import { AUTH_USER , AUTH_ERROR} from './types';


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
            localStorage.setItem('token',result.getAccessToken().getJwtToken());
            //redirect user to home
            browserHistory.push('/home')

        },

        onFailure: function(err) {
          console.log(err.message);
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
        Value: "11-11-1111"
      }),new CognitoUserAttribute({
        Name: 'given_name',
        Value: givenName
      })
    ];

    return function(dispatch){
        const username =givenName.toLowercase + Date.now().toString();
        userPool.signUp(username, password, attributeList, null, (err, result) => {
            if (err) {
                dispatch(authError('System Error!, please contact support.'));
                return;
              }
                //dispatch({type:AUTH_USER})
                console.dir(result);
                browserHistory.push('/payment');
              });

    }


}


export function authError(error){
   return {
     type: AUTH_ERROR,
     payload:error
   }
}
