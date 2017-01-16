



import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import reduxThunk from 'redux-thunk';



import App from './components/app';
import Signin from './components/auth/signin';
import Signup from './components/auth/signup';
import Signout from './components/auth/signout';
import Confirmation from './components/auth/Confirmation';

import Home from './components/home';
import RequireAuth from './components/auth/require_auth';
import Landing from './components/landing';
import { AUTH_USER } from './actions/types';




import reducers from './reducers';








const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store =createStoreWithMiddleware(reducers);

const accessToken = localStorage.getItem('CognitoIdentityServiceProvider.5q9vq8tbro1m2pol9dp7jp277i.1484188460538.accessToken');


if(accessToken){
   store.dispatch({type: AUTH_USER});
}
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
     <Route   path="/" component={App} >
     <IndexRoute component={Landing}/>
      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
        <Route path="/confirmation" component={Confirmation} />
      <Route path="/signout" component={Signout} />
      <Route path="/home" component={RequireAuth(Home)} />
     </Route>
    </Router>
  </Provider>
  , document.querySelector('.rendered'));
