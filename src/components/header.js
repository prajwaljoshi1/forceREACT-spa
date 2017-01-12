import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';



 class Header extends Component{


   renderLinks(){
     if(this.props.authenticated){

       return<li className="nav-item navbar-auth" key={3}>
         <Link  className="nav-link" to="/signout" >
             Sign out
         </Link>
         </li>

     } else{

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
   }





  render(){

    return(
    <nav className = "navbar">
        <ul className="nav navbar-nav">
            {this.renderLinks()}
        </ul>
    </nav>);
  }

}


function mapStateToProps(state){
  return{
    authenticated: state.auth.authenticated
  };
}


 export default connect(mapStateToProps)(Header)
