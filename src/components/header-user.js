import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';




 class HeaderUser extends Component{

  render(){
    const givenName = localStorage.getItem('currentUser_givenName');
    const familyName =localStorage.getItem('currentUser_familyName');

    return(
        <div className="header-user text-right">
            <Link to="/profile"> <h1>{givenName} {familyName}</h1> </Link>

            <Link to="/salesforceorgs"><h4>{this.props.salesforceOrg.name}</h4></Link>
            <hr/>
        </div>

    );


  }
}

function mapStateToProps(state){
  return{ salesforceOrg : state.forcereact.activeSalesforceOrg}
}



 export default connect( mapStateToProps)(HeaderUser)
