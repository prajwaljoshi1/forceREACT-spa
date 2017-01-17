



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
import Confirmation from './components/auth/Confirmation';

import Home from './components/home';
import Page1 from './components/page1';
import Page2 from './components/page2';
import Page3 from './components/page3';
import Page4 from './components/page4';
import RequireAuth from './components/auth/require_auth';
import Landing from './components/landing';
import { AUTH_USER } from './actions/types';
import cognitoConfig from './cognito-config';




import reducers from './reducers';








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
       });
     }


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
     <Route   path="/" component={App} >
     <IndexRoute component={Landing}/>
      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
        <Route path="/confirmation" component={Confirmation} />
      <Route path="/signout" component={RequireAuth(Signout)} />
      <Route path="/home" component={RequireAuth(Home)} />
      <Route path="/page1" component={RequireAuth(Page1)} />
      <Route path="/page2" component={RequireAuth(Page2)} />
      <Route path="/page3" component={RequireAuth(Page3)} />
      <Route path="/page4" component={RequireAuth(Page4)} />
     </Route>
    </Router>
  </Provider>
  , document.getElementById('container'));
