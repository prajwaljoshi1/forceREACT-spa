import React, { Component} from 'react';
import {reduxForm } from 'redux-form';
import * as actions from '../../actions';

class Confirmation extends Component{

  handleFormSubmit({confirmationCode}){
    console.log(confirmationCode);
    const username =this.props.username;
    const password =this.props.userPassword;

    this.props.confirmUser({confirmationCode, username, password})

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

    const { handleSubmit, fields:{ confirmationCode }} = this.props;

    return(
      <div className="container">
      <p>
        An email has been sent to {this.props.userEmail} with a confirmation code. Please enter the code below to finish your registration.
      </p>
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
          <label>Enter Confirmation Code:</label>
        <input {...confirmationCode} className="form-control" />
        {confirmationCode.touched && confirmationCode.error  && <div className="error">{confirmationCode.error}</div>}
        </fieldset>
        <fieldset className="form-group">
          {this.renderAlert()}
        </fieldset>

        <button action="submit"  className="btn btn-primary">Confirm User</button>
      </form>
      <button  className="btn btn-primary">Request Code Again</button>
      <button  className="btn btn-primary">Cancel</button>

    </div>)
  }
}


function validate(formProps){
  const errors = {};

    if(!formProps.confirmationCode){
      errors.confirmationCode = 'Please enter verification code';
    }





  return errors;
}




function mapStateToProps(state){
  return{
    errorMessage: state.auth.error,
    username: state.signup.username,
    userEmail: state.signup.userEmail,
    userPassword: state.signup.userPassword
  }
}

export default reduxForm({
  form:'Confirmation',
  fields: ['confirmationCode'],
  validate
}, mapStateToProps, actions)(Confirmation);
