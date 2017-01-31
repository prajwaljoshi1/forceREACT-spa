import React , {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAllSalesforceOrgs , loginToSalesForceOrg } from '../../actions/forcereact/salesforceorg';
import { Link } from 'react-router';
import NewSalesforceOrg from './newsalesforceorg';




class SalesforceOrgs extends Component{



  constructor(props){
    super(props);
    this.state = {toggleNewForm: false};
}


handleAccountClick(index,e){
  e.preventDefault();
  this.props.loginToSalesForceOrg(index);
}


  componentWillMount(){
    this.props.fetchAllSalesforceOrgs();
  }


  renderList(){
    return this.props.salesforceOrgs.map((salesforceOrg) => {
      let index = salesforceOrg.id

      return(
        <li className="list-group-item index-list" key={salesforceOrg.id} onClick={this.handleAccountClick.bind(this, index)} >
          <div className="index-link">
            <h4><strong>{salesforceOrg.name}</strong></h4>
          </div>
        </li>

      )
    });
  }

  handleAddNewSalesforceOrgClick(e){
    e.preventDefault();
    this.setState({toggleNewForm: true})
    console.log(this.state.toggleNewForm);
  }


 newForm(){

   if(this.state.toggleNewForm){

         return <NewSalesforceOrg />
   }else{
      return (
          <button className="btn btn-outline-primary" onClick={this.handleAddNewSalesforceOrgClick.bind(this)}>
            Add a new salesforceOrg
          </button>
     );


   }
 }


render(){



  return(
      <div className="container">
        <div className="page-content">

          <h3>Select a SalesforceOrg</h3>
          <ul className="list-group">
           {this.renderList()}
          </ul>

          {this.newForm()}
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


export default connect(mapStateToProps, {fetchAllSalesforceOrgs , loginToSalesForceOrg})(SalesforceOrgs);
