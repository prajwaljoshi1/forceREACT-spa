import React, { Component } from 'react';
import { connect } from 'react-redux';

import HeaderAuth from './header-auth';
import HeaderApp from './header-app';

import classNames from 'classNames'

import Payment from './auth/payment'

import SalesforceOrgs from './forcereact/salesforceorgs';


class App extends Component {

  constructor(props){
    super(props);
    this.state = {toggled: false};
}

componentWillMount(){

}


  toggleSidenav(e){
    e.preventDefault();
    if(this.state.toggled ==true){
      this.setState({toggled: false});
    }else{

      this.setState({toggled: true});
    }
  }







  render() {
   console.log("APP RENDER");

    let classes = classNames('application-wrapper', {toggled: this.state.toggled});

      if(this.props.authenticated){

        if(this.props.subscriptionStatus === 'ACTIVE'){
          console.log("TEST => ", this.props.activeSalesforceOrg);
            if(!this.props.activeSalesforceOrg.id){
                return (
                  <SalesforceOrgs />
                )
            }


            return (
              <div>
                <div className={classes}>
                <div className="navigation-wrapper">
                  <HeaderApp />
                  </div>
                  <div className="page-content-wrapper">
                  <div className="container-fluid">
                    <a href="#" className="btn btn-default btn-lg btn-sidenav-toggle" onClick={this.toggleSidenav.bind(this)}> Menu</a>
                    <div className="container">
                          {this.props.children}
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }else if(this.props.subscriptionStatus === 'INACTIVE'){
            console.log("profile page");
          } else if(this.props.subscriptionStatus === 'UNSIGNED'){

            return (<div>
                  <Payment />
                  </div>
            );

          }



      }else{
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
    authenticated: state.auth.authenticated,
    subscriptionStatus: state.auth.subscriptionStatus,
    activeSalesforceOrg: state.forcereact.activeSalesforceOrg
  };
}


 export default connect(mapStateToProps)(App)
