
// import { Config, CognitoIdentityCredentials } from "aws-sdk";
// import { CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js";
// import cognitoConfig from "../cognito-config";
//
//
// Config.region = cognitoConfig.region;
// Config.credentials = new CognitoIdentityCredentials({
//   IdentityPoolId: appConfig.IdentityPoolId
// });
//
// const userPool = new CognitoUserPool({
//   UserPoolId: appConfig.UserPoolId,
//   ClientId: appConfig.ClientId,
// });


export function signinUser({ email, password }){

  return function(dispatch){

    //
    // submit email/password to cognito
    //
    // if request is good update state to indicate user is authenticated
    // save jwt token
    // redirect to route/home
    //
    // if the request is bad show an error to the user


  }


}
