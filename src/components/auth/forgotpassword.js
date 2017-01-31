import React, { Component} from 'react';
import {reduxForm } from 'redux-form';
import * as actions from '../../actions';

import { Config, CognitoIdentityCredentials } from "aws-sdk";
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails  } from "amazon-cognito-identity-js";
import cognitoConfig from "../../cognito-config";

Config.region = cognitoConfig.region;
Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: cognitoConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});


class ForgotPassword extends Component{

  constructor(props){
      super(props);
      this.state = {
        step: 1,
      }
      this.email = '';
    }



  sendVerificationCode(e){
    e.preventDefault();
    var that = this;
    this.email = this.refs.email.value;
    var userData = {
          Username : this.email,
          Pool : userPool
        };

    var cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
        onSuccess: function (result) {
                // console.log('call result: ' + result);
        },
        onFailure: function(err) {
                console.log(err);
              },
      inputVerificationCode(){
                  that.nextStep();
              }
    });

  }

  setNewPassword(){
    const that = this
    var userData = {
          Username : this.email,
          Pool : userPool
        };

    var cognitoUser = new CognitoUser(userData);
        var verificationCode = this.refs.verificationCode.value;
        var newPassword = this.refs.password1.value;
        cognitoUser.confirmPassword(verificationCode, newPassword, {
           onSuccess: function (result) {
             that.nextStep();
           },
           onFailure: function(err) {
             console.log(err);
           }
         });


  }
  showError(){
    
  }

  nextStep(){
    this.setState({
      step : this.state.step + 1
    });
  }

  goBack(e){
  e.preventDefault();
    browserHistory.push('/signin');
}


  emailSubmitForm(){

    return (


      <div className="container">
      <form onSubmit={this.sendVerificationCode.bind(this)}>
        <fieldset className="form-group">
          <label>Email:</label>
        <input ref="email" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
        </fieldset>
        <button action="submit"  className="btn btn-primary">Reset Password </button>
      </form>
      <a href="# "  onClick={this.goBack}>Cancel</a>
    </div>
    )

  }


  changePasswordForm(e){
    return(

      <div className="container">
   <h1>Reset Password</h1>

   <div className="form-group">
   <label>Verification Code:</label>
       <input type="text" id="inputCode" ref="verificationCode" className="form-control" placeholder="verification code" required/>
   </div>

   <div className="form-group">
       <label className="">Password
       </label>
       <input type="password" id="password" ref="password1" className="form-control" placeholder="Password" required pattern=".{8,25}" required title="8 to 25 characters"/>
   </div>

   <div className="form-group">
       <label className="">Password Confirmation
       </label>
       <input type="password" ref="password2" className="form-control" id="confirm-password" placeholder="Confirm Password" required/>
   </div>
   <div className="form-group">
       <button className="btn btn-lg btn-primary " onClick={this.setNewPassword.bind(this)}>Change Password</button>
   </div>
</div>

    )
  }


  showSuccessMessage(){
    return (
      <h1> password changed </h1>
    )
  }

  render(){


    switch (this.state.step) {
    			case 1:
    				return <div>  {this.emailSubmitForm()}</div>
    			case 2:
    				return <div>  {this.changePasswordForm()}</div>
    			case 3:
    				return <div>  {this.showSuccessMessage()}</div>
    		}

      }

    }


export default ForgotPassword;
