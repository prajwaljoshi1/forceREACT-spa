
import React, { Component} from 'react';
import {reduxForm } from 'redux-form';
import * as actions from '../../actions/forcereact/salesforcesignup';


class NewSalesforceOrg extends Component{

  handleFormSubmit({id, password}){
    console.log("test");
    this.props.signinToSalesforce({id, password})
  }

  renderAlert(){
    if(this.props.errorMessage){
      return(
            <div className="alert alert-danger">
                {this.props.errorMessage}
            </div>
      );
    }
  }

  render(){
    const { handleSubmit, fields:{ id, password }} = this.props;

    return(
      <div className="container">
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
          <label>Salesforce Id:</label>
        <input {...id} className="form-control" />
        {id.touched && id.error  && <div className="error">{id.error}</div>}

          </fieldset>
        <fieldset className="form-group">
        <label>Password:</label>
          <input {...password} className="form-control" type="password" />
          {password.touched && password.error  && <div className="error">{password.error}</div>}

        </fieldset>
        <fieldset className="form-group">
          {this.renderAlert()}
        </fieldset>
        <button action="submit"  className="btn btn-primary">Add Salesforce Account</button>
      </form>
    </div>)
  }

}


function validate(formProps){
  const errors = {};

    if(!formProps.id){
      errors.id = 'Please enter Salesforce Id'
    }

    if(!formProps.password){
      errors.password = 'Please Salesforce password'
    }

  return errors;
}




function mapStateToProps(state){
  return{
    errorMessage: state.auth.error
  }
}



export default reduxForm({
  form:'NewSalesforceOrg',
  fields: ['id', 'password'],
  validate
}, mapStateToProps, actions)(NewSalesforceOrg);
