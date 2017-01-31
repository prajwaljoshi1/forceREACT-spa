import React, { Component } from 'react';
import InlineEdit from 'react-edit-inline';
import HeaderUser from './header-user';

import { Config, CognitoIdentityCredentials } from "aws-sdk";
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails  } from "amazon-cognito-identity-js";
import cognitoConfig from "../cognito-config";


Config.region = cognitoConfig.region;
Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: cognitoConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});



export default class Profile extends Component {

  constructor(props){
      super(props);
      this.state = {
        givenName: '',
        familyName: '',
        email: '',
        phoneNumber:''
      }
      const that = this;
    }



    componentWillMount(){
      const that = this;
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
               console.log(err);
                return;
            }
              cognitoUser.getUserAttributes(function(err, result) {
                if(err){
                  console.log(err);
                }else{
                    const userDetails = {};
                    for(let i = 0; i< result.length ; i++){
                        userDetails[result[i].getName()] = result[i].getValue();
                    }
                    that.setState({
                      givenName: userDetails.given_name,
                      familyName: userDetails.family_name,
                      email: userDetails.email,
                      phoneNumber:userDetails.phone_number
                    });

                }
              });
          });
        }
     }

     updateAttribute(attr, value ){
       const cognitoUser = userPool.getCurrentUser();

       if (cognitoUser != null) {
         cognitoUser.getSession(function(err, session) {
             if (err) {
                console.log(err);
                 return;
             }
             var attributeList = [];
             var att = {
                 Name : attr,
                 Value : value
             };
             var attribute = new CognitoUserAttribute(att);
             attributeList.push(attribute);

             cognitoUser.updateAttributes(attributeList, function(err, result) {
                 if (err) {
                     console.log(err);
                     return;
                 }
                 console.log('call result: ' + result);
             });

          });
        }
     }


     verifyEmail(){
        // hide  verify button

       const cognitoUser = userPool.getCurrentUser();

       if (cognitoUser != null) {
         cognitoUser.getSession(function(err, session) {
             if (err) {
                console.log(err);
                 return;
             }
             cognitoUser.getAttributeVerificationCode('email', {
               onSuccess: function (result) {
                 console.log('call result: ' + result);
               },
               onFailure: function(err) {
                  console.log(err);
                },
                inputVerificationCode: function() {
                  var verificationCode = prompt('Please input verification code emailed to you : ' ,'');
                  cognitoUser.verifyAttribute('email', verificationCode, this);
                }
              });
          });
       }
     }


    givenNameChanged(data){
      this.updateAttribute('given_name',data.givenName);
    }

    familyNameChanged(data){
      this.updateAttribute('family_name',data.familyName);
    }

    emailChanged(data){
      this.updateAttribute('email',data.email);
      //show verify button
    }

    phoneNumberChanged(data){
      this.updateAttribute('phone_number',data.phoneNumber);
    }

    customValidateText(text) {
      return (text.length > 0 && text.length < 64);
    }


  render() {


    const style = {
      backgroundColor: 'white',
      minWidth: '400',
      display: 'inline-block',
      margin: 0,
      padding: 0,
      fontSize: 18,
      outline: 0,
      border: 0
    }


    return (
      <div>
        <HeaderUser/>
        <h3>Profile</h3>
        <div>
            <table className="table table-lg table-hover">
              <tbody>
                <tr>
                    <th scope="row">
                        <span>Given Name:  </span>
                    </th>
                    <td>
                        <InlineEdit
                          validate={this.customValidateText}
                          activeClassName="editing"
                          text={this.state.givenName}
                          paramName="givenName"
                          change={this.givenNameChanged.bind(this)}
                          style={style}
                        />
                  </td>
                </tr>
                <tr>
                    <th scope="row">
                        <span>Family Name:  </span>
                    </th>
                    <td>
                        <InlineEdit
                          validate={this.customValidateText}
                          activeClassName="editing"
                          text={this.state.familyName}
                          paramName="familyName"
                          change={this.familyNameChanged.bind(this)}
                          style={style}
                        />
                  </td>
                </tr>

                <tr>
                    <th scope="row">
                        <span>Email:  </span>
                    </th>
                    <td>
                        <InlineEdit
                          validate={this.customValidateText}
                          activeClassName="editing"
                          text={this.state.email}
                          paramName="email"
                          change={this.emailChanged.bind(this)}
                          style={style}
                        />
                          <button className="btn btn-sm btn-btn-default">verify</button>
                  </td>
                </tr>

                <tr>
                    <th scope="row">
                        <span>Phone Number:  </span>
                    </th>
                    <td>
                        <InlineEdit
                          validate={this.customValidateText}
                          activeClassName="editing"
                          text={this.state.phoneNumber}
                          paramName="phoneNumber"
                          change={this.phoneNumberChanged.bind(this)}
                          style={style}
                        />
                  </td>
                </tr>
              </tbody>
            </table>

        </div>
      </div>
    );
  }
}
