import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';

class Signup extends Component{

  render(){

    const { handleSubmit, fields: {email,mobile,givenName,familyName, password, passwordConfirm}} = this.props;

    return(
      <form>

          <fieldset className="form-group">
            <label>Email:</label>
            <input className="form-control"   {...email}/>
          </fieldset>

          <fieldset className="form-group">
            <label>First Name:</label>
            <input className="form-control"   {...givenName}/>
          </fieldset>

          <fieldset className="form-group">
            <label>Last Name:</label>
            <input className="form-control"   {...familyName}/>
          </fieldset>

          <fieldset className="form-group">
            <label>Mobile:</label>
            <input className="form-control"   {...mobile}/>
          </fieldset>

          <fieldset className="form-group">
            <label>Password:</label>
            <input className="form-control"   {...password} type="password" />
          </fieldset>

          <fieldset className="form-group">
            <label>Confirm Password:</label>
            <input className="form-control"   {...passwordConfirm} type="password" />
          </fieldset>
          <button action="submit" className="btn btn-primary">Sign up!</button>
      </form>
    );
  }
}





export default reduxForm({
  form :'signup',
  fields:['email','mobile','givenName', 'familyName', 'password', 'passwordConfirm']
})(Signup);
