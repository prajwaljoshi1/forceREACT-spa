import React, { Component } from 'react';
import { Link } from 'react-router';



 class HeaderAuth extends Component{


   renderLinks(){

       return [
         <li className="nav-item navbar-auth" key={2}>
         <Link  className="nav-link" to="/signin" activeClassName="auth-list-active">
             Sign In
         </Link>
         </li>,
         <li className="nav-item navbar-auth" key={1}>
         <Link  className="nav-link" to="/signup" activeClassName="auth-list-active">
             Sign Up
         </Link>
         </li>
       ];
     }






  render(){

    return(
    <nav className = "navbar  navbar-light">

        <ul className="nav navbar-nav navbar-auth">
            {this.renderLinks()}
        </ul>
    </nav>);
  }

}



 export default HeaderAuth;
