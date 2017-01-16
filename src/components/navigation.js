import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';



 class Navigation extends Component{

  render(){


    return(
      <div className="navigation-wrapper">
            <ul className="sidebar-nav">
                <li className="sidebar-brand">
                    <a href="#">
                        themeREACT
                    </a>
                </li>
                <li className="nav-item navbar-app" key={4}>
                  <Link  className="nav-link" to="/home" >
                      Home
                  </Link>
                  </li>
                  <li className="nav-item navbar-app" key={5}>
                    <Link  className="nav-link" to="/home" >
                        Task
                    </Link>
                    </li>
                    <li className="nav-item navbar-app" key={6}>
                      <Link  className="nav-link" to="/home" >
                          Schedule
                      </Link>
                      </li>
                      <li className="nav-item navbar-app" key={7}>
                        <Link  className="nav-link" to="/home" >
                            Help
                        </Link>
                        </li>

            </ul>
        </div>
    )

    return(
    <nav className = "navbar">
        <ul className="nav navbar-nav">
            {this.renderLinks()}
        </ul>
    </nav>);
  }

}



 export default Navigation
