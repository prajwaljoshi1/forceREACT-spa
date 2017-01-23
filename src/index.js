



import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import reduxThunk from 'redux-thunk';

import { CognitoUserPool } from "amazon-cognito-identity-js";





import App from './components/app';
import Signin from './components/auth/signin';
import Signup from './components/auth/signup';
import Signout from './components/auth/signout';
import Payment from './components/auth/payment';
import Confirmation from './components/auth/Confirmation';

import Dashboard from './components/dashboard';
import Tasks from './components/tasks';
import Schedules from './components/schedules';
import Profile from './components/profile';
import RequireAuth from './middleware/require_auth';
import Landing from './components/landing';

// forceREACT Specific components

import NewSalesforceOrg from './components/forcereact/new-salesforceorg';

import { AUTH_USER, SUBSCRIPTION_STATUS } from './actions/types';
import cognitoConfig from './cognito-config';
import axios from  'axios';

import reducers from './reducers';

import API from './api-url';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store =createStoreWithMiddleware(reducers);


const poolData = {
          UserPoolId : cognitoConfig.UserPoolId,
          ClientId : cognitoConfig.ClientId
        };
var userPool = new CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();
if (cognitoUser != null) {

     cognitoUser.getSession(function(err, session) {
         if (err) {
            alert(err);
             return;
         }

         store.dispatch({type: AUTH_USER});
         const authCode = session.idToken.jwtToken ;
         axios.get(API.getSubscriptionStatus, {
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization': authCode
                        }
                      })
                      .then(function (response) {

                           store.dispatch({type:SUBSCRIPTION_STATUS, payload: response.data.status});
                           console.log("RESPONSE => ", response.data.status);
                             console.log("START2");
                          renderApp();

                        });

        });
     }else{
       renderApp();
     }



  function renderApp(){
    ReactDOM.render(
      <Provider store={store}>
        <Router history={browserHistory}>
         <Route   path="/" component={App} >
         <IndexRoute component={Landing}/>
          <Route path="/signin" component={Signin} />
          <Route path="/signup" component={Signup} />
          <Route path="/confirmation" component={Confirmation} />
          <Route path="/payment" component={RequireAuth(Payment)} />
          <Route path="/signout" component={RequireAuth(Signout)} />
          <Route path="/dashboard" component={RequireAuth(Dashboard)} />
          <Route path="/tasks" component={RequireAuth(Tasks)} />
          <Route path="/schedules" component={RequireAuth(Schedules)} />
          <Route path="/profile" component={RequireAuth(Profile)} />
          <Route path="/newsalesforceorg" component={RequireAuth(NewSalesforceOrg)} />
         </Route>
        </Router>
      </Provider>
      , document.getElementById('container'));
  }
