import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';



 class HeaderApp extends Component{

  render(){

    return(
            <ul className="sidebar-nav">
                <li className="sidebar-brand">
                    <a href="/home">
                        themeREACT
                    </a>
                </li>
                <li className="nav-item navbar-app" key={4}>
                  <Link  className="nav-link" to="/home" >
                      Home
                  </Link>
                  </li>
                  <li className="nav-item navbar-app" key={5}>
                    <Link  className="nav-link" to="/page2" >
                        Task
                    </Link>
                    </li>
                    <li className="nav-item navbar-app" key={6}>
                      <Link  className="nav-link" to="/page3" >
                          Schedule
                      </Link>
                      </li>
                      <li className="nav-item navbar-app" key={7}>
                        <Link  className="nav-link" to="/page4" >
                            Help
                        </Link>
                        </li>
                        <li className="nav-item navbar-auth" key={3}>
                          <Link  className="nav-link" to="/signout" >
                              Sign out
                          </Link>
                          </li>

            </ul>
    );


  }
}



 export default HeaderApp
