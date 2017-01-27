import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';



 class HeaderUser extends Component{

  render(){

    return(
        <div className="header-user text-right">
            <Link to="/profile"> <h1>John Doe</h1> </Link>

            <Link to="/salesforceorgs"><h4>Active SalesforceOrg</h4></Link>
            <hr/>
        </div>

    );


  }
}



 export default HeaderUser
