import React , {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAllSalesforceOrgs } from '../../actions/forcereact/salesforceorg';
import { Link } from 'react-router';




class SalesforceOrgs extends Component{

  componentWillMount(){
    this.props.fetchAllSalesforceOrgs();
  }


  renderList(){
    return this.props.salesforceOrgs.map((salesforceOrg) => {
      return(
        <li className="list-group-item index-list" key={salesforceOrg.id}>
          <div className="index-link">
            <h4><strong>{salesforceOrg.name}</strong></h4>
          </div>
        </li>

      )
    });
  }

render(){

  return(
      <div className="page-content">

          <h3>Select a SalesforceOrg</h3>
          <ul className="list-group">
           {this.renderList()}
          </ul>

          <div className="text-center">
          <Link to="/newsalesforceorg" className="btn btn-outline-primary">
           Add a new salesforceOrg
           </Link>
           </div>
      </div>
    )
  }

}

function mapStateToProps(state){
  return{
    salesforceOrgs: state.forcereact.allSalesforceOrgs,
  }
}


export default connect(mapStateToProps, {fetchAllSalesforceOrgs})(SalesforceOrgs);
