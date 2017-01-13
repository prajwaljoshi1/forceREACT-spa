import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';

class Signup extends Component{

  handleFormSubmit(formProps){

  this.props.signupUser({email:formProps.email, password:formProps.password, givenName:formProps.givenName, familyName:formProps.familyName, mobile:formProps.mobile})
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

    const { handleSubmit, fields: {email,mobile,givenName,familyName, password, passwordConfirm}} = this.props;

    return(
        <div className="container">
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>

          <fieldset className="form-group">
            <label>Email:</label>
            <input className="form-control"   {...email}/>
            {email.touched && email.error  && <div className="error">{email.error}</div>}
          </fieldset>

          <fieldset className="form-group">
            <label>First Name:</label>
            <input className="form-control"   {...givenName}/>
            {givenName.touched && givenName.error  && <div className="error">{givenName.error}</div>}
          </fieldset>

          <fieldset className="form-group">
            <label>Last Name:</label>
            <input className="form-control"   {...familyName}/>
            {familyName.touched && familyName.error  && <div className="error">{familyName.error}</div>}
          </fieldset>

          <fieldset className="form-group">
            <label>Mobile:</label>
            <input className="form-control"   {...mobile}/>
            {mobile.touched && mobile.error  && <div className="error">{mobile.error}</div>}
          </fieldset>

          <fieldset className="form-group">
            <label>Password:</label>
            <input className="form-control"   {...password} type="password" />
            {password.touched && password.error  && <div className="error">{password.error}</div>}
          </fieldset>

          <fieldset className="form-group">
            <label>Confirm Password:</label>
            <input className="form-control"   {...passwordConfirm} type="password" />
            {passwordConfirm.touched && passwordConfirm.error  && <div className="error">{passwordConfirm.error}</div>}
          </fieldset>
          <fieldset>
          {this.renderAlert()}
            </fieldset>
          <button action="submit" className="btn btn-primary">Sign up!</button>
      </form>
    </div>);
  }
}

function validate(formProps){
  const errors = {};

    if(!formProps.email){
      errors.email = 'Please enter a valid email address'
    }

    if(!formProps.mobile){
      errors.mobile = 'Please enter a valid email address'
    }

    if(!formProps.givenName){
      errors.givenName = 'Please enter your first name'
    }

    if(!formProps.familyName){
      errors.familyName = 'Please enter your last name'
    }

    if(!formProps.password){
      errors.password = 'Please enter a password'
    }

    if(!formProps.passwordConfirm){
      errors.passwordConfirm = 'Please enter password again'
    }

    if(formProps.password !== formProps.passwordConfirm){
      errors.password = 'Password must match';
    }

  return errors;
}

function mapStateToProps(state){
  return {errorMessage:state.auth.error}
}

export default reduxForm({
  form :'signup',
  fields:['email','mobile','givenName', 'familyName', 'password', 'passwordConfirm'],
  validate
}, mapStateToProps, actions)(Signup);
