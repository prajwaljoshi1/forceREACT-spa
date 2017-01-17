import React, { Component } from 'react';
import { connect } from 'react-redux';

import HeaderAuth from './header-auth';
import HeaderApp from './header-app';

import classNames from 'classNames'


class App extends Component {

  constructor(props){
    super(props);
    this.state = {toggled: false};
}


  toggleSidenav(e){
    e.preventDefault();
    console.log(this.state);
    if(this.state.toggled ==true){
      this.setState({toggled: false});
    }else{

      this.setState({toggled: true});
    }


  }



  render() {

    let classes = classNames('application-wrapper', {toggled: this.state.toggled});

      if(this.props.authenticated){
        console.log("23");
          return (
            <div>
              <div className={classes}>
              <div className="navigation-wrapper">
                <HeaderApp />
                </div>
                <div className="page-content-wrapper">
                <div className="container-fluid">
                  <a href="#" className="btn btn-default btn-lg" onClick={this.toggleSidenav.bind(this)}> Menu</a>
                  <div className="container">
                        {this.props.children}
                  </div>
                  </div>
                </div>
              </div>
            </div>
          );

      }else{
        console.log("32");
        return (
            <div>
              <HeaderAuth />
              {this.props.children}
            </div>
          );
      }

  }
}


function mapStateToProps(state){
  return{
    authenticated: state.auth.authenticated
  };
}


 export default connect(mapStateToProps)(App)
