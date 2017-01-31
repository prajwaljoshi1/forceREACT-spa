import React, { Component} from 'react';
import {reduxForm } from 'redux-form';
import * as actions from '../../actions';
import { browserHistory  } from 'react-router';

class Signin extends Component{

  handleFormSubmit({email, password}){
    this.props.signinUser({email:email, password:password})
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

  handleForgotPasswordClick(){
    browserHistory.push('/forgotpassword');
  }

  render(){
    const { handleSubmit, fields:{ email, password }} = this.props;

    return(
      <div className="container">
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
          <label>Email:</label>
        <input {...email} className="form-control" />
        {email.touched && email.error  && <div className="error">{email.error}</div>}

          </fieldset>
        <fieldset className="form-group">
        <label>Password:</label>
          <input {...password} className="form-control" type="password" />
          {password.touched && password.error  && <div className="error">{password.error}</div>}

        </fieldset>
        <fieldset className="form-group">
          {this.renderAlert()}
        </fieldset>
        <button action="submit"  className="btn btn-primary">Sign in</button>
      </form>
      <a href="#" className="" onClick={this.handleForgotPasswordClick.bind(this)}>Forgot Password</a>

    </div>)
  }

}


function validate(formProps){
  const errors = {};

    if(!formProps.email){
      errors.email = 'Please enter your Email'
    }

    if(!formProps.password){
      errors.password = 'Please enter your password'
    }

  return errors;
}




function mapStateToProps(state){
  return{
    errorMessage: state.auth.error
  }
}



export default reduxForm({
  form:'Signin',
  fields: ['email', 'password'],
  validate
}, mapStateToProps, actions)(Signin);
